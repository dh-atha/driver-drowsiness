/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Video, ShieldAlert, Loader } from 'lucide-react';

interface WebcamDetectionProps {
  onEarCalculated: (leftEar: number, rightEar: number, averageEar: number) => void;
  onFaceDetected: (detected: boolean) => void;
  isActive: boolean;
}

export default function WebcamDetection({ onEarCalculated, onFaceDetected, isActive }: WebcamDetectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isFaceMeshLoaded, setIsFaceMeshLoaded] = useState(false);
  
  const activeCameraRef = useRef<any>(null);
  const activeFaceMeshRef = useRef<any>(null);

  useEffect(() => {
    // Check if MediaPipe is available in global scope
    const checkMediaPipe = () => {
      if ((window as any).FaceMesh && (window as any).Camera) {
        setIsFaceMeshLoaded(true);
      } else {
        setTimeout(checkMediaPipe, 200);
      }
    };
    checkMediaPipe();
  }, []);

  useEffect(() => {
    if (!isActive) {
      stopCamera();
      return;
    }

    if (!isFaceMeshLoaded) return;

    startCameraAndDetection();

    return () => {
      stopCamera();
    };
  }, [isActive, isFaceMeshLoaded]);

  const stopCamera = () => {
    try {
      if (activeCameraRef.current) {
        activeCameraRef.current.stop();
        activeCameraRef.current = null;
      }
      if (activeFaceMeshRef.current) {
        activeFaceMeshRef.current.close();
        activeFaceMeshRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      onFaceDetected(false);
      setLoading(false);
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  const startCameraAndDetection = async () => {
    setLoading(true);
    setErrorMsg(null);
    setPermissionGranted(null);

    try {
      // 1. Check for camera permission first
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      setPermissionGranted(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 2. Initialize MediaPipe FaceMesh
      const FaceMeshClass = (window as any).FaceMesh;
      const CameraClass = (window as any).Camera;

      if (!FaceMeshClass || !CameraClass) {
        throw new Error("Pustaka MediaPipe gagal dimuat dari CDN.");
      }

      const faceMesh = new FaceMeshClass({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true, // refine landmarks around eyes
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      faceMesh.onResults(handleResults);
      activeFaceMeshRef.current = faceMesh;

      // 3. Initialize Camera Utilities
      if (videoRef.current) {
        const camera = new CameraClass(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && activeFaceMeshRef.current) {
              await activeFaceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        camera.start();
        activeCameraRef.current = camera;
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Failed to start camera or face mesh:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg("Izin akses kamera ditolak. Silakan aktifkan izin kamera di browser Anda.");
        setPermissionGranted(false);
      } else {
        setErrorMsg(`Gagal mengaktifkan kamera: ${err.message || err}`);
      }
      setLoading(false);
      onFaceDetected(false);
    }
  };

  const getDistance = (p1: any, p2: any) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const calculateEAR = (
    landmarks: any[], 
    p1: number, p2: number, p3: number, 
    p4: number, p5: number, p6: number
  ) => {
    const pt1 = landmarks[p1];
    const pt2 = landmarks[p2];
    const pt3 = landmarks[p3];
    const pt4 = landmarks[p4];
    const pt5 = landmarks[p5];
    const pt6 = landmarks[p6];

    if (!pt1 || !pt2 || !pt3 || !pt4 || !pt5 || !pt6) return 0.0;

    const vertical1 = getDistance(pt2, pt6);
    const vertical2 = getDistance(pt3, pt5);
    const horizontal = getDistance(pt1, pt4);

    if (horizontal === 0) return 0.0;
    return (vertical1 + vertical2) / (2.0 * horizontal);
  };

  const handleResults = (results: any) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      onFaceDetected(false);
      drawEmptyCanvas();
      return;
    }

    onFaceDetected(true);
    const landmarks = results.multiFaceLandmarks[0];

    // Left Eye Landmarks (MediaPipe Indices):
    // p1 = 362 (inner corner)
    // p2 = 385, p3 = 387 (upper lids)
    // p4 = 263 (outer corner)
    // p5 = 373, p6 = 380 (lower lids)
    const leftEar = calculateEAR(landmarks, 362, 385, 387, 263, 373, 380);

    // Right Eye Landmarks (MediaPipe Indices):
    // p1 = 33 (outer corner)
    // p2 = 160, p3 = 158 (upper lids)
    // p4 = 133 (inner corner)
    // p5 = 153, p6 = 144 (lower lids)
    const rightEar = calculateEAR(landmarks, 33, 160, 158, 133, 153, 144);

    const averageEar = (leftEar + rightEar) / 2;

    onEarCalculated(leftEar, rightEar, averageEar);
    drawOverlay(landmarks);
  };

  const drawEmptyCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawOverlay = (landmarks: any[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video stream size
    if (videoRef.current) {
      const width = videoRef.current.videoWidth || 640;
      const height = videoRef.current.videoHeight || 480;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const leftIndices = [362, 385, 387, 263, 373, 380];
    const rightIndices = [33, 160, 158, 133, 153, 144];

    // Mirror horizontal coordinates if video is mirrored
    const isMirrored = true;

    const drawEye = (indices: number[], color: string) => {
      ctx.beginPath();
      indices.forEach((index, i) => {
        const pt = landmarks[index];
        if (!pt) return;
        const x = isMirrored ? (1 - pt.x) * canvas.width : pt.x * canvas.width;
        const y = pt.y * canvas.height;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw individual keypoints
      indices.forEach(index => {
        const pt = landmarks[index];
        if (!pt) return;
        const x = isMirrored ? (1 - pt.x) * canvas.width : pt.x * canvas.width;
        const y = pt.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    // Draw left and right eye outlines in high contrast neon color
    drawEye(leftIndices, '#3b82f6'); // Blue for left
    drawEye(rightIndices, '#6366f1'); // Indigo for right

    // Draw some facial outline nodes to indicate tech tracking
    const faceOutlineIndices = [10, 152, 234, 454]; // forehead, chin, left cheek, right cheek
    faceOutlineIndices.forEach(index => {
      const pt = landmarks[index];
      if (!pt) return;
      const x = isMirrored ? (1 - pt.x) * canvas.width : pt.x * canvas.width;
      const y = pt.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.fill();
    });
  };

  return (
    <div className="relative bg-[#16191F] rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center border border-white/5 shadow-xl">
      {/* Video feeds */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -scale-x-100"
        style={{ display: isActive && permissionGranted ? 'block' : 'none' }}
      />
      
      {/* Canvas Drawing Layer */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        style={{ display: isActive && permissionGranted ? 'block' : 'none' }}
      />

      {/* Screen states overlays */}
      {!isActive && (
        <div className="z-10 flex flex-col items-center text-center p-6 space-y-3">
          <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center text-slate-400 border border-white/5 shadow-inner">
            <CameraOff className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Deteksi Kamera Non-Aktif</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Aktifkan mode webcam untuk memantau wajah secara real-time melalui kamera laptop Anda.
            </p>
          </div>
        </div>
      )}

      {isActive && loading && (
        <div className="absolute inset-0 bg-[#0F1115]/95 z-20 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="relative flex items-center justify-center">
            <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
            <Video className="w-4 h-4 text-white absolute" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Menyalakan Kamera...</h4>
            <p className="text-xs text-slate-400 mt-1">Mengunduh modul FaceMesh & menginisialisasi input video.</p>
          </div>
        </div>
      )}

      {isActive && errorMsg && (
        <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center text-center p-6 space-y-3 border border-rose-500/20">
          <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="max-w-xs">
            <h4 className="text-sm font-bold text-white">Gagal Memulai Deteksi</h4>
            <p className="text-xs text-rose-400 mt-1 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Tracking active indicator badge */}
      {isActive && permissionGranted && !loading && !errorMsg && (
        <div className="absolute top-3 right-3 bg-indigo-500/80 backdrop-blur-md text-indigo-150 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase z-20 shadow-lg border border-indigo-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE TRACKING
        </div>
      )}
    </div>
  );
}
