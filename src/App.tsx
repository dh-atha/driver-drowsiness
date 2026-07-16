/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  Camera,
  Sliders,
  Play,
  Pause,
  Award,
  HelpCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Layers,
} from "lucide-react";

import { DriverStatus, EarLog, SystemSettings } from "./types";
import { startAlarmBuzzer, stopAlarmBuzzer } from "./utils/audio";
import { useTensorflowModel } from "./hooks/useTensorflowModel";
import type { EyePrediction } from "./types";

// Components
import WebcamDetection from "./components/WebcamDetection";
import ManualSimulation from "./components/ManualSimulation";
import Dashboard from "./components/Dashboard";
import ReportViewer from "./components/ReportViewer";

export default function App() {
  const [useWebcam, setUseWebcam] = useState(false);

  // Real-time calculated EAR (webcam mode)
  const [currentEar, setCurrentEar] = useState(0.28);
  const [leftEar, setLeftEar] = useState(0.28);
  const [rightEar, setRightEar] = useState(0.28);
  const [isFaceTracked, setIsFaceTracked] = useState(false);

  // Manual simulation EAR
  const [simulatedEar, setSimulatedEar] = useState(0.28);

  // General settings
  const [settings, setSettings] = useState<SystemSettings>({
    earThreshold: 0.22,
    durationThreshold: 1.5,
    isAlarmEnabled: true,
  });

  // Alarm and Status
  const [status, setStatus] = useState<DriverStatus>(DriverStatus.Safe);
  const [closureDuration, setClosureDuration] = useState(0);

  // Event transition logging
  const [logs, setLogs] = useState<EarLog[]>([]);

  // OscilloScope Chart History (last 45 points)
  const [chartData, setChartData] = useState<any[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({ index: i, EAR: 0.28 }));
  });

  const {
    model: eyeClassifierModel,
    status: eyeClassifierStatus,
    error: eyeClassifierError,
  } = useTensorflowModel({
    modelUrl: "/models/eye-classifier/model.json",
  });

  const lastStatusRef = useRef<DriverStatus | null>(null);
  const lastChartAppendRef = useRef(0);
  const closedSinceRef = useRef<number | null>(null);
  const eyePredictionRef = useRef<EyePrediction | null>(null);

  const latestRef = useRef({
    useWebcam,
    currentEar,
    leftEar,
    rightEar,
    simulatedEar,
    isFaceTracked,
    earThreshold: settings.earThreshold,
    durationThreshold: settings.durationThreshold,
    isAlarmEnabled: settings.isAlarmEnabled,
    mlClosedProbability: 0,
    eyeClassifierStatus,
  });

  // Keep latestRef up to date on every render
  latestRef.current = {
    useWebcam,
    currentEar,
    leftEar,
    rightEar,
    simulatedEar,
    isFaceTracked,
    earThreshold: settings.earThreshold,
    durationThreshold: settings.durationThreshold,
    isAlarmEnabled: settings.isAlarmEnabled,
    mlClosedProbability:
      eyePredictionRef.current?.averageClosedProbability ?? 0,
    eyeClassifierStatus,
  };

  // Append new points to telemetry chart history
  const appendChartData = (val: number) => {
    setChartData((prev) => {
      const nextIndex = prev.length > 0 ? prev[prev.length - 1].index + 1 : 1;
      const nextData = [...prev, { index: nextIndex, EAR: val }];
      if (nextData.length > 45) {
        nextData.shift();
      }
      return nextData;
    });
  };

  // Reset telemetry logs & chart
  const handleResetSimulation = () => {
    setLogs([]);
    setChartData(
      Array.from({ length: 30 }, (_, i) => ({ index: i, EAR: 0.28 })),
    );
    closedSinceRef.current = null;
    setClosureDuration(0);
    setStatus(DriverStatus.Safe);
    stopAlarmBuzzer();
  };

  // Callback from Webcam Component
  const handleEarCalculated = (left: number, right: number, avg: number) => {
    setLeftEar(left);
    setRightEar(right);
    setCurrentEar(avg);

    const now = Date.now();
    if (now - lastChartAppendRef.current > 150) {
      // Limit chart drawing to ~7 FPS to save CPU and render cleanly
      lastChartAppendRef.current = now;
      appendChartData(avg);
    }
  };

  const handleEyePrediction = (prediction: EyePrediction | null) => {
    eyePredictionRef.current = prediction;
    latestRef.current.mlClosedProbability =
      prediction?.averageClosedProbability ?? 0;
  };

  // Update simulator value & update chart
  const handleSimulatedEarChange = (val: number) => {
    setSimulatedEar(val);
    appendChartData(val);
  };

  // Logic: Calculate Eye-Closure Timer and Drowsiness Status transitions
  useEffect(() => {
    const interval = setInterval(() => {
      const {
        useWebcam: currentUseWebcam,
        currentEar: currentAvgEar,
        simulatedEar: currentSimEar,
        isFaceTracked: currentFaceTracked,
        earThreshold,
        durationThreshold,
        mlClosedProbability,
        eyeClassifierStatus: currentEyeClassifierStatus,
      } = latestRef.current;

      const activeEar = currentUseWebcam ? currentAvgEar : currentSimEar;
      const isReady = !currentUseWebcam || currentFaceTracked;
      const modelClosed =
        currentUseWebcam &&
        currentEyeClassifierStatus === "ready" &&
        mlClosedProbability >= 0.85;

      if (isReady && (activeEar < earThreshold || modelClosed)) {
        if (closedSinceRef.current === null) {
          closedSinceRef.current = Date.now();
        }
        const elapsed = (Date.now() - closedSinceRef.current) / 1000;
        setClosureDuration(elapsed);

        const targetStatus =
          elapsed >= durationThreshold
            ? DriverStatus.Drowsy
            : DriverStatus.Warning;
        setStatus((prev) => {
          if (prev !== targetStatus) return targetStatus;
          return prev;
        });
      } else {
        closedSinceRef.current = null;
        setClosureDuration((prev) => {
          if (prev !== 0) return 0;
          return prev;
        });
        setStatus((prev) => {
          if (prev !== DriverStatus.Safe) return DriverStatus.Safe;
          return prev;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Handle Alarm Audio Buzzer activation based on status and settings
  useEffect(() => {
    if (status === DriverStatus.Drowsy && settings.isAlarmEnabled) {
      startAlarmBuzzer();
    } else {
      stopAlarmBuzzer();
    }

    return () => {
      stopAlarmBuzzer();
    };
  }, [status, settings.isAlarmEnabled]);

  // Log transition changes chronologically
  useEffect(() => {
    if (status !== lastStatusRef.current) {
      lastStatusRef.current = status;
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      const {
        useWebcam: activeWebcam,
        currentEar: latestCurrent,
        leftEar: latestLeft,
        rightEar: latestRight,
        simulatedEar: latestSim,
      } = latestRef.current;

      const newLog: EarLog = {
        timestamp: timeStr,
        leftEar: activeWebcam ? latestLeft : latestSim,
        rightEar: activeWebcam ? latestRight : latestSim,
        averageEar: activeWebcam ? latestCurrent : latestSim,
        status: status,
      };

      setLogs((prev) => [...prev.slice(-19), newLog]);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-200 font-sans flex flex-col relative overflow-x-hidden">
      {/* Flashing overlay if Drowsy alarm sounds */}
      {status === DriverStatus.Drowsy && (
        <div className="absolute inset-0 bg-rose-600/10 pointer-events-none animate-pulse z-40" />
      )}

      {/* Modern Navigation Header */}
      <header className="bg-[#16191F] border-b border-white/5 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight font-display flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white italic underline decoration-indigo-500 decoration-2 underline-offset-4">
                  VigilanceEye CV
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  | Driver Drowsiness Detection System
                </span>
              </h1>
              <p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">
                COMPUTER VISION • KELOMPOK 5 (IF141)
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
            <button
              onClick={() => {
                setUseWebcam(false);
                setStatus(DriverStatus.Safe);
                setClosureDuration(0);
                appendChartData(0.28);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !useWebcam
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              MODE SIMULATOR
            </button>
            <button
              onClick={() => {
                setUseWebcam(true);
                setStatus(DriverStatus.Safe);
                setClosureDuration(0);
                setIsFaceTracked(false);
                appendChartData(0.28);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                useWebcam
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              MODE WEBCAM
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Academic Presentation Card */}
        <div className="bg-gradient-to-r from-[#16191F] via-indigo-950/20 to-[#16191F] border border-white/5 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">
                Presentasi Proyek Akademik
              </span>
            </div>
            <h2 className="text-sm md:text-base font-black tracking-tight text-slate-100">
              Sistem Deteksi Kantuk Pengemudi Menggunakan OpenCV & EAR
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sebuah rekayasa solusi keselamatan berkendara berbasis kecerdasan
              buatan. Menggunakan parameter geometris kelopak mata (
              <span className="font-semibold text-indigo-400">
                Eye Aspect Ratio / EAR
              </span>
              ) secara kontinu untuk mengidentifikasi kantuk dan mencegah
              terjadinya kecelakaan mikro-tidur (
              <span className="font-semibold text-indigo-400">microsleep</span>
              ).
            </p>
          </div>
          <div className="flex gap-2 shrink-0 text-xs">
            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-mono font-semibold">
              Matkul: IF141 Computer Vision
            </span>
          </div>
        </div>

        {/* Interactive Input (Webcam or Simulator) */}
        <div>
          {useWebcam ? (
            <div className="bg-[#16191F] border border-white/5 shadow-xl rounded-2xl p-5 flex flex-col gap-3 text-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Deteksi Wajah Webcam
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Menganalisis feed video lokal secara real-time
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Webcam Aktif
                </div>
              </div>

              <div className="w-full">
                <WebcamDetection
                  onEarCalculated={handleEarCalculated}
                  onFaceDetected={setIsFaceTracked}
                  onEyePrediction={handleEyePrediction}
                  eyeClassifierModel={eyeClassifierModel}
                  eyeClassifierStatus={eyeClassifierStatus}
                  isActive={useWebcam}
                />
              </div>

              <div className="bg-black/20 border border-white/5 rounded-lg p-2.5 text-[10px] text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-300 block mb-0.5">
                  Panduan Membaca Webcam:
                </span>
                1. Izinkan akses kamera browser.
                <br />
                2. Posisikan wajah tepat di depan kamera.
                <br />
                3. Ketika kelopak mata menutup, kurva EAR akan menukik ke bawah.
                <br />
                4. Model CNN dipakai sebagai sinyal tambahan saat tersedia.
                {eyeClassifierError ? (
                  <>
                    <br />
                    <span className="text-rose-400">
                      Model CNN gagal dimuat: {eyeClassifierError}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <ManualSimulation
              simulatedEar={simulatedEar}
              onSimulatedEarChange={handleSimulatedEarChange}
              threshold={settings.earThreshold}
            />
          )}
        </div>

        {/* Dashboard Metrics & Oscilloscope Chart */}
        <Dashboard
          currentEar={useWebcam ? currentEar : simulatedEar}
          status={status}
          isFaceTracked={isFaceTracked}
          closureDuration={closureDuration}
          settings={settings}
          onSettingsChange={setSettings}
          logs={logs}
          chartData={chartData}
          onResetSimulation={handleResetSimulation}
          useWebcam={useWebcam}
        />

        {/* Expandable Project Report Section */}
        <ReportViewer />
      </main>

      {/* Decorative clean academic footer */}
      <footer className="bg-[#0a0c10] text-slate-500 border-t border-white/5 py-4 mt-6 text-center text-[10px] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© Kelompok 5 • IF141 Computer Vision Proyek Akhir</span>
          <div className="flex gap-4">
            <span className="flex gap-2 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Teknologi: OpenCV, MediaPipe, React 19, Tailwind CSS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
