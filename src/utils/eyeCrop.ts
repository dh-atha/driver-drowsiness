import * as tf from "@tensorflow/tfjs";

export const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
export const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];

export type EyeSourceElement = HTMLVideoElement | HTMLCanvasElement;

export interface EyeCropOptions {
  inputSize: number;
  paddingRatio?: number;
  normalization?: "zeroToOne" | "minusOneToOne";
}

export interface EyeBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
}

export function getSourceDimensions(source: EyeSourceElement) {
  if (source instanceof HTMLVideoElement) {
    return {
      width: source.videoWidth || source.clientWidth || source.width,
      height: source.videoHeight || source.clientHeight || source.height,
    };
  }

  return {
    width: source.width,
    height: source.height,
  };
}

export function createFrameTensor(
  source: EyeSourceElement,
): tf.Tensor3D | null {
  const { width, height } = getSourceDimensions(source);

  if (!width || !height) {
    return null;
  }

  return tf.browser.fromPixels(source);
}

export function getEyeBoundingBox(
  landmarks: NormalizedLandmark[],
  eyeIndices: number[],
  frameWidth: number,
  frameHeight: number,
  paddingRatio = 0.25,
): EyeBoundingBox | null {
  const points = eyeIndices
    .map((index) => landmarks[index])
    .filter((point): point is NormalizedLandmark => Boolean(point));

  if (points.length === 0) {
    return null;
  }

  const xs = points.map((point) => point.x * frameWidth);
  const ys = points.map((point) => point.y * frameHeight);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const boxWidth = Math.max(1, maxX - minX);
  const boxHeight = Math.max(1, maxY - minY);
  const paddingX = boxWidth * paddingRatio;
  const paddingY = boxHeight * paddingRatio;

  const x = Math.max(0, Math.floor(minX - paddingX));
  const y = Math.max(0, Math.floor(minY - paddingY));
  const right = Math.min(frameWidth, Math.ceil(maxX + paddingX));
  const bottom = Math.min(frameHeight, Math.ceil(maxY + paddingY));

  return {
    x,
    y,
    width: Math.max(1, right - x),
    height: Math.max(1, bottom - y),
  };
}

export function createEyeTensorFromFrameTensor(
  frameTensor: tf.Tensor3D,
  landmarks: NormalizedLandmark[],
  eyeIndices: number[],
  options: EyeCropOptions,
): tf.Tensor4D | null {
  const {
    inputSize,
    paddingRatio = 0.25,
    normalization = "zeroToOne",
  } = options;
  const [frameHeight, frameWidth] = frameTensor.shape;
  const boundingBox = getEyeBoundingBox(
    landmarks,
    eyeIndices,
    frameWidth,
    frameHeight,
    paddingRatio,
  );

  if (!boundingBox) {
    return null;
  }

  return tf.tidy(() => {
    const cropped = frameTensor.slice(
      [boundingBox.y, boundingBox.x, 0],
      [boundingBox.height, boundingBox.width, frameTensor.shape[2]],
    );

    const resized = tf.image.resizeBilinear(
      cropped,
      [inputSize, inputSize],
      true,
    );
    const normalized =
      normalization === "minusOneToOne"
        ? resized.toFloat().div(127.5).sub(1)
        : resized.toFloat().div(255);

    return normalized.expandDims(0) as tf.Tensor4D;
  });
}

export function createEyeTensorFromSource(
  source: EyeSourceElement,
  landmarks: NormalizedLandmark[],
  eyeIndices: number[],
  options: EyeCropOptions,
): tf.Tensor4D | null {
  const frameTensor = createFrameTensor(source);

  if (!frameTensor) {
    return null;
  }

  try {
    return createEyeTensorFromFrameTensor(
      frameTensor,
      landmarks,
      eyeIndices,
      options,
    );
  } finally {
    frameTensor.dispose();
  }
}
