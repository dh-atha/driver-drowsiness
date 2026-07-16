import * as tf from "@tensorflow/tfjs";
import {
  createEyeTensorFromFrameTensor,
  createFrameTensor,
  LEFT_EYE_INDICES,
  RIGHT_EYE_INDICES,
  type EyeSourceElement,
  type NormalizedLandmark,
} from "./eyeCrop";
import type { EyePrediction } from "../types";

export interface EyeInferenceOptions {
  inputSize: number;
  paddingRatio?: number;
  normalization?: "zeroToOne" | "minusOneToOne";
}

function readClosedProbability(output: tf.Tensor | tf.Tensor[]): number {
  const tensor = Array.isArray(output) ? output[0] : output;
  const values = tensor.dataSync();

  if (values.length === 0) {
    return 0.5;
  }

  if (values.length === 1) {
    return Math.min(1, Math.max(0, values[0]));
  }

  const openProbability = values[0];
  const closedProbability = values[1];
  const sum = openProbability + closedProbability;

  if (sum > 0.5 && Math.abs(sum - 1) < 0.35) {
    return Math.min(1, Math.max(0, closedProbability));
  }

  return Math.min(1, Math.max(0, closedProbability));
}

function disposePrediction(output: tf.Tensor | tf.Tensor[]) {
  if (Array.isArray(output)) {
    output.forEach((tensor) => tensor.dispose());
    return;
  }

  output.dispose();
}

export function inferEyePrediction(
  model: tf.LayersModel,
  source: EyeSourceElement,
  landmarks: NormalizedLandmark[],
  options: EyeInferenceOptions,
): EyePrediction | null {
  const frameTensor = createFrameTensor(source);

  if (!frameTensor) {
    return null;
  }

  let leftTensor: tf.Tensor4D | null = null;
  let rightTensor: tf.Tensor4D | null = null;

  try {
    leftTensor = createEyeTensorFromFrameTensor(
      frameTensor,
      landmarks,
      LEFT_EYE_INDICES,
      options,
    );
    rightTensor = createEyeTensorFromFrameTensor(
      frameTensor,
      landmarks,
      RIGHT_EYE_INDICES,
      options,
    );

    if (!leftTensor || !rightTensor) {
      return null;
    }

    const leftOutput = model.predict(leftTensor);
    const rightOutput = model.predict(rightTensor);

    const leftClosedProbability = readClosedProbability(leftOutput);
    const rightClosedProbability = readClosedProbability(rightOutput);
    const averageClosedProbability =
      (leftClosedProbability + rightClosedProbability) / 2;

    disposePrediction(leftOutput);
    disposePrediction(rightOutput);

    return {
      leftClosedProbability,
      rightClosedProbability,
      averageClosedProbability,
      isClosedByModel: averageClosedProbability >= 0.85,
    };
  } finally {
    leftTensor?.dispose();
    rightTensor?.dispose();
    frameTensor.dispose();
  }
}
