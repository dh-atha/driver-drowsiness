/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  ShieldCheck, AlertTriangle, ShieldAlert, Volume2, VolumeX, Eye, Timer, RefreshCw 
} from 'lucide-react';
import { DriverStatus, EarLog, SystemSettings } from '../types';

interface DashboardProps {
  currentEar: number;
  status: DriverStatus;
  isFaceTracked: boolean;
  closureDuration: number;
  settings: SystemSettings;
  onSettingsChange: (newSettings: SystemSettings) => void;
  logs: EarLog[];
  chartData: any[];
  onResetSimulation: () => void;
  useWebcam: boolean;
}

export default function Dashboard({
  currentEar,
  status,
  isFaceTracked,
  closureDuration,
  settings,
  onSettingsChange,
  logs,
  chartData,
  onResetSimulation,
  useWebcam
}: DashboardProps) {

  // Get status color themes
  const getStatusStyle = () => {
    switch (status) {
      case DriverStatus.Safe:
        return {
          bg: 'bg-[#16191F] border-green-500/20',
          text: 'text-green-400',
          badge: 'bg-green-500/10 text-green-400 border border-green-500/20',
          icon: <ShieldCheck className="w-10 h-10 text-green-500 animate-pulse" />
        };
      case DriverStatus.Warning:
        return {
          bg: 'bg-[#16191F] border-amber-500/20',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
          icon: <AlertTriangle className="w-10 h-10 text-amber-500 animate-bounce" />
        };
      case DriverStatus.Drowsy:
        return {
          bg: 'bg-[#16191F] border-rose-500/30 animate-pulse',
          text: 'text-rose-400',
          badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          icon: <ShieldAlert className="w-10 h-10 text-rose-500" />
        };
    }
  };

  const style = getStatusStyle();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-slate-200">
      {/* 1. Status and Metrics Column */}
      <div className="lg:col-span-1 space-y-4">
        {/* Status card */}
        <div className={`p-4 border rounded-2xl shadow-xl transition-colors duration-200 ${style.bg}`}>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-black/40 border border-white/5 rounded-xl shadow-inner">{style.icon}</div>
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
                Status Pengemudi
              </span>
              <h2 className={`text-base font-extrabold mt-1 truncate ${style.text}`}>{status}</h2>
            </div>
          </div>
          
          {/* Progress to Alarm indicator */}
          {closureDuration > 0 && (
            <div className="mt-3.5 pt-3.5 border-t border-white/5">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                  MENUTUP MATA
                </span>
                <span className="font-mono">
                  {closureDuration.toFixed(1)}s / {settings.durationThreshold.toFixed(1)}s
                </span>
              </div>
              <div className="w-full h-2.5 bg-black/40 border border-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ${
                    status === DriverStatus.Drowsy ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (closureDuration / settings.durationThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Telemetry numbers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#16191F] border border-white/5 shadow-xl p-3 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Nilai EAR Saat Ini
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-white">
                {currentEar.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-500">ratio</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">
              Ambang Batas: <span className="font-mono font-bold text-indigo-400">{settings.earThreshold.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#16191F] border border-white/5 shadow-xl p-3 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Tracking Wajah
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                useWebcam 
                  ? (isFaceTracked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-ping')
                  : 'bg-slate-500'
              }`} />
              <span className="text-sm font-black text-slate-300">
                {!useWebcam ? 'Simulator' : (isFaceTracked ? 'TERDETEKSI' : 'MENCARI...')}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 truncate">
              {useWebcam ? 'Menggunakan kamera laptop' : 'Mode input manual'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Chart Column */}
      <div className="lg:col-span-2 bg-[#16191F] border border-white/5 shadow-xl rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-white">Gelombang EAR (Eye Aspect Ratio)</h3>
            <p className="text-[10px] text-slate-400">Oskiloskop pemantau interval pejam mata</p>
          </div>
          <button 
            onClick={onResetSimulation}
            className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            RESET TELEMETRI
          </button>
        </div>

        {/* Recharts container */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="index" tick={false} stroke="rgba(255, 255, 255, 0.1)" />
              <YAxis domain={[0.0, 0.45]} stroke="rgba(255, 255, 255, 0.1)" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ fontSize: 10, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#1A1D23', color: '#f1f5f9' }}
                labelFormatter={() => 'Frame'}
              />
              <Area 
                type="monotone" 
                dataKey="EAR" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEar)" 
                isAnimationActive={false}
              />
              {/* Threshold indicator line */}
              <ReferenceLine 
                y={settings.earThreshold} 
                stroke="#f43f5e" 
                strokeDasharray="4 4" 
                label={{ value: `Ambang (${settings.earThreshold.toFixed(2)})`, position: 'top', fill: '#f43f5e', fontSize: 9, fontWeight: 'bold' }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Settings & Log Panel */}
      <div className="lg:col-span-3 bg-[#16191F] border border-white/5 shadow-xl rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sliders Block */}
        <div className="space-y-3.5 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-xs font-bold text-white">Pengaturan Sensitivitas Algoritma</h3>
            {/* Alarm Sound toggle */}
            <button
              onClick={() => onSettingsChange({ ...settings, isAlarmEnabled: !settings.isAlarmEnabled })}
              className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                settings.isAlarmEnabled
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              {settings.isAlarmEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              ALARM: {settings.isAlarmEnabled ? 'AKTIF' : 'MATI'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Threshold Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-350">Ambang Batas EAR (Threshold)</span>
                <span className="font-bold text-indigo-400 font-mono">{settings.earThreshold.toFixed(2)}</span>
              </div>
              <input 
                type="range"
                min="0.18"
                max="0.28"
                step="0.01"
                value={settings.earThreshold}
                onChange={(e) => onSettingsChange({ ...settings, earThreshold: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500">
                Nilai EAR di bawah batas ini dianggap sebagai mata terpejam.
              </p>
            </div>

            {/* Duration Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-350">Durasi Pejam (Detik)</span>
                <span className="font-bold text-indigo-400 font-mono">{settings.durationThreshold.toFixed(1)}s</span>
              </div>
              <input 
                type="range"
                min="0.8"
                max="3.0"
                step="0.1"
                value={settings.durationThreshold}
                onChange={(e) => onSettingsChange({ ...settings, durationThreshold: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500">
                Lama mata terpejam terus-menerus sebelum alarm visual/suara berbunyi.
              </p>
            </div>
          </div>
        </div>

        {/* Rolling Event Logs Block */}
        <div className="md:col-span-1 bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
              Log Aktivitas Sistem
            </span>
            <div className="space-y-1.5 overflow-y-auto max-h-24 pr-1 text-[10px]">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic py-4 text-center">Menunggu telemetri...</div>
              ) : (
                logs.slice().reverse().map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-1">
                    <span className="font-mono text-slate-500 shrink-0">{log.timestamp}</span>
                    <span className={`font-semibold ml-2 text-right ${
                      log.status === DriverStatus.Drowsy 
                        ? 'text-rose-400' 
                        : (log.status === DriverStatus.Warning ? 'text-amber-400' : 'text-green-400')
                    }`}>
                      {log.status === DriverStatus.Drowsy ? 'Drowsiness!' : log.status.split(' / ')[0]}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <p className="text-[9px] text-slate-500 italic mt-2 text-center border-t border-white/5 pt-1">
            Mencatat perubahan status deteksi pengemudi secara kronologis
          </p>
        </div>
      </div>
    </div>
  );
}
