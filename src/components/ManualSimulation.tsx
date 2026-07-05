/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sliders, Eye, EyeOff, Sparkles } from 'lucide-react';

interface ManualSimulationProps {
  simulatedEar: number;
  onSimulatedEarChange: (val: number) => void;
  threshold: number;
}

export default function ManualSimulation({ simulatedEar, onSimulatedEarChange, threshold }: ManualSimulationProps) {
  const presets = [
    { label: "Terbuka Lebar", value: 0.35, desc: "Sangat segar / aktif", color: "bg-emerald-500/20 text-emerald-400" },
    { label: "Mata Normal", value: 0.28, desc: "Kondisi aman berkendara", color: "bg-indigo-500/20 text-indigo-300" },
    { label: "Sayu / Mengantuk", value: 0.21, desc: "Ambang batas waspada", color: "bg-amber-500/20 text-amber-350" },
    { label: "Mata Tertutup", value: 0.12, desc: "Tidur / microsleep", color: "bg-rose-500/20 text-rose-400" }
  ];

  // Map simulated ear to visual heights (for eye SVG rendering)
  // Max EAR is ~0.40 (height 100%), threshold is ~0.22, min EAR is ~0.10 (fully closed)
  const calculateEyeHeight = (ear: number) => {
    const minEar = 0.10;
    const maxEar = 0.38;
    const pct = Math.max(0, Math.min(100, ((ear - minEar) / (maxEar - minEar)) * 100));
    return pct;
  };

  const eyeHeightPercent = calculateEyeHeight(simulatedEar);

  return (
    <div className="bg-[#16191F] border border-white/5 shadow-xl rounded-2xl p-5 flex flex-col h-full justify-between text-slate-250">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sliders className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="text-sm font-bold text-white">Simulator EAR Manual</h3>
          <p className="text-[11px] text-slate-400">Sesuaikan kelopak mata tanpa webcam</p>
        </div>
      </div>

      {/* Visual representation of eyes opening/closing */}
      <div className="bg-black/20 rounded-xl p-4 my-2 border border-white/5 flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
          Visualisasi Model Geometri Mata
        </span>
        
        <div className="flex gap-8 my-1 justify-center items-center">
          {/* Left Eye */}
          <div className="relative w-20 h-10 border border-white/10 rounded-full bg-black/40 flex items-center justify-center overflow-hidden">
            {/* Pupil */}
            <div 
              className="absolute w-8 h-8 rounded-full bg-slate-300 border-2 border-indigo-500 transition-transform duration-100"
              style={{
                transform: `scaleY(${eyeHeightPercent / 100})`,
                opacity: eyeHeightPercent < 20 ? 0.15 : 1
              }}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-1 left-2 opacity-80" />
            </div>

            {/* Eyelids overlay closing downwards */}
            <div 
              className="absolute top-0 left-0 w-full bg-[#1A1D23] border-b border-white/10 transition-all duration-150"
              style={{ height: `${Math.max(0, 100 - eyeHeightPercent) / 2}%` }}
            />
            <div 
              className="absolute bottom-0 left-0 w-full bg-[#1A1D23] border-t border-white/10 transition-all duration-150"
              style={{ height: `${Math.max(0, 100 - eyeHeightPercent) / 2}%` }}
            />

            {/* Simulated closed line */}
            {eyeHeightPercent < 15 && (
              <div className="absolute w-14 h-[1.5px] bg-slate-400 rounded-full" />
            )}
          </div>

          {/* Right Eye */}
          <div className="relative w-20 h-10 border border-white/10 rounded-full bg-black/40 flex items-center justify-center overflow-hidden">
            {/* Pupil */}
            <div 
              className="absolute w-8 h-8 rounded-full bg-slate-300 border-2 border-indigo-500 transition-transform duration-100"
              style={{
                transform: `scaleY(${eyeHeightPercent / 100})`,
                opacity: eyeHeightPercent < 20 ? 0.15 : 1
              }}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-1 left-2 opacity-80" />
            </div>

            {/* Eyelids overlay closing downwards */}
            <div 
              className="absolute top-0 left-0 w-full bg-[#1A1D23] border-b border-white/10 transition-all duration-150"
              style={{ height: `${Math.max(0, 100 - eyeHeightPercent) / 2}%` }}
            />
            <div 
              className="absolute bottom-0 left-0 w-full bg-[#1A1D23] border-t border-white/10 transition-all duration-150"
              style={{ height: `${Math.max(0, 100 - eyeHeightPercent) / 2}%` }}
            />

            {/* Simulated closed line */}
            {eyeHeightPercent < 15 && (
              <div className="absolute w-14 h-[1.5px] bg-slate-400 rounded-full" />
            )}
          </div>
        </div>

        {/* Live values */}
        <div className="flex items-center gap-1.5 mt-3 text-xs">
          <span className="font-semibold text-slate-400">Nilai EAR:</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
            simulatedEar < threshold 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' 
              : 'bg-white/5 text-white border-white/5'
          }`}>
            {simulatedEar.toFixed(3)}
          </span>
          <span className="text-[10px] text-slate-500">
            (Ambang: {threshold.toFixed(2)})
          </span>
        </div>
      </div>

      {/* Main Slider Control */}
      <div className="space-y-1.5 my-2">
        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span>TERTUTUP (Min)</span>
          <span>TERBUKA (Max)</span>
        </div>
        <input 
          type="range"
          min="0.10"
          max="0.40"
          step="0.01"
          value={simulatedEar}
          onChange={(e) => onSimulatedEarChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Quick Presets Grid */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSimulatedEarChange(preset.value)}
            className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
              Math.abs(simulatedEar - preset.value) < 0.015
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-350 shadow-lg'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{preset.label}</span>
              <span className="text-[10px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-1 rounded">
                {preset.value.toFixed(2)}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{preset.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
