"""
Lightweight eye open/closed classifier training script.

Dataset layout expected:
data/
  train/
    buka/
    tutup/
  val/
    buka/
    tutup/
  test/
    buka/
    tutup/

The exported browser bundle is written to:
public/models/eye-classifier/
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import tensorflow as tf


IMG_SIZE = 96
BATCH_SIZE = 32
EPOCHS_HEAD = 12
EPOCHS_FINE_TUNE = 8

CLASS_NAMES = ["Buka", "Tutup"]


def build_datasets(data_dir: Path):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir / "train",
        label_mode="binary",
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        shuffle=True,
        seed=42,
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir / "val",
        label_mode="binary",
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        shuffle=False,
    )

    test_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir / "test",
        label_mode="binary",
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        color_mode="rgb",
        shuffle=False,
    )

    autotune = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=autotune)
    val_ds = val_ds.cache().prefetch(buffer_size=autotune)
    test_ds = test_ds.cache().prefetch(buffer_size=autotune)

    return train_ds, val_ds, test_ds


def build_model() -> tf.keras.Model:
    base = tf.keras.applications.MobileNetV3Small(
        include_top=False,
        weights="imagenet",
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        alpha=0.35,
        name="feature_extractor",
    )
    base.trainable = False

    inputs = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3), name="eye_input")
    x = tf.keras.layers.Rescaling(1.0 / 255.0)(inputs)
    x = tf.keras.layers.RandomFlip("horizontal")(x)
    x = tf.keras.layers.RandomRotation(0.05)(x)
    x = tf.keras.layers.RandomZoom(0.08)(x)
    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(1, activation="sigmoid", name="closed_probability")(x)

    model = tf.keras.Model(inputs, outputs, name="eye_state_mobilenetv3_small")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="binary_crossentropy",
        metrics=["accuracy", tf.keras.metrics.AUC(name="auc")],
    )
    return model


def fine_tune_model(model: tf.keras.Model) -> None:
    base = model.get_layer("feature_extractor")
    if not isinstance(base, tf.keras.Model):
        return

    base.trainable = True
    for layer in base.layers[:-20]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="binary_crossentropy",
        metrics=["accuracy", tf.keras.metrics.AUC(name="auc")],
    )


def export_to_tfjs(keras_model_path: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    command = [
        "tensorflowjs_converter",
        "--input_format=keras",
        str(keras_model_path),
        str(output_dir),
    ]

    subprocess.run(command, check=True)


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python ml/train_eye_classifier.py /path/to/data")

    data_dir = Path(sys.argv[1]).resolve()
    artifacts_dir = Path("artifacts/eye_classifier").resolve()
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    train_ds, val_ds, test_ds = build_datasets(data_dir)
    model = build_model()

    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=4, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, min_lr=1e-6),
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(artifacts_dir / "best.keras"),
            monitor="val_accuracy",
            save_best_only=True,
            save_weights_only=False,
        ),
    ]

    model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_HEAD, callbacks=callbacks)

    fine_tune_model(model)
    model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_FINE_TUNE, callbacks=callbacks)

    keras_model_path = artifacts_dir / "eye_classifier.keras"
    model.save(keras_model_path)

    evaluation = model.evaluate(test_ds, verbose=2)
    metrics = dict(zip(model.metrics_names, evaluation))

    export_dir = Path("public/models/eye-classifier").resolve()
    export_to_tfjs(keras_model_path, export_dir)

    metadata = {
        "model": "eye_state_mobilenetv3_small",
        "inputSize": IMG_SIZE,
        "classes": CLASS_NAMES,
        "threshold": 0.85,
        "testMetrics": metrics,
    }
    (export_dir / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    print(f"Saved Keras model to: {keras_model_path}")
    print(f"Exported TensorFlow.js model to: {export_dir}")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()