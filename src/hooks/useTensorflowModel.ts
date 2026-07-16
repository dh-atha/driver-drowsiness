import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

export type TensorflowModelStatus = "idle" | "loading" | "ready" | "error";

interface UseTensorflowModelOptions {
  modelUrl?: string;
  preferredBackend?: string;
}

interface UseTensorflowModelResult {
  model: tf.LayersModel | null;
  status: TensorflowModelStatus;
  error: string | null;
}

export function useTensorflowModel(
  options: UseTensorflowModelOptions = {},
): UseTensorflowModelResult {
  const {
    modelUrl = "/models/eye-classifier/model.json",
    preferredBackend = "webgl",
  } = options;
  const modelRef = useRef<tf.LayersModel | null>(null);
  const [status, setStatus] = useState<TensorflowModelStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadModel = async () => {
      setStatus("loading");
      setError(null);

      try {
        await tf.ready();

        if (preferredBackend && tf.getBackend() !== preferredBackend) {
          try {
            await tf.setBackend(preferredBackend);
          } catch {
            await tf.setBackend("cpu");
          }
        }

        const model = await tf.loadLayersModel(modelUrl);

        if (cancelled) {
          model.dispose();
          return;
        }

        modelRef.current = model;
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;

        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load TensorFlow.js model.",
        );
      }
    };

    void loadModel();

    return () => {
      cancelled = true;

      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
    };
  }, [modelUrl, preferredBackend]);

  return {
    model: modelRef.current,
    status,
    error,
  };
}
