/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DriverStatus {
  Safe = "Active / Safe",
  Warning = "Squinting / Warning",
  Drowsy = "Drowsiness Detected! Wake Up!"
}

export interface EarLog {
  timestamp: string;
  leftEar: number;
  rightEar: number;
  averageEar: number;
  status: DriverStatus;
}

export interface SystemSettings {
  earThreshold: number;       // EAR value below which eyes are considered closed (typically ~0.22)
  durationThreshold: number;  // Seconds of continuous closure before alarm triggers (typically ~2.0s)
  isAlarmEnabled: boolean;    // Toggle sound alert
}
