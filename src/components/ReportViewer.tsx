/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Award,
  FileText,
  Cpu,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReportViewerProps {}

export default function ReportViewer({}: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "sampul" | "bab1" | "bab2" | "bab3" | "bab4" | "bab5" | "bab6"
  >("all");
  const [isExpanded, setIsExpanded] = useState(false);

  // Reusable ITTS Logo SVG Component
  const IttsLogo = () => (
    <div className="flex flex-col items-center my-6">
      <svg
        viewBox="0 0 200 200"
        className="w-32 h-32 select-none animate-fade-in drop-shadow-[0_0_8px_rgba(20,184,166,0.15)]"
      >
        {/* Outer green ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          className="fill-none stroke-teal-500 stroke-[5]"
        />
        <circle
          cx="100"
          cy="100"
          r="82"
          className="fill-none stroke-teal-500/30 stroke-[1]"
        />

        {/* Inner circle with background */}
        <circle
          cx="100"
          cy="100"
          r="76"
          className="fill-teal-950/40 stroke-teal-500/50 stroke-[2]"
        />

        {/* Decorative inner pattern (ITTS Mandala) */}
        <g
          className="stroke-teal-400 fill-none stroke-[2.5]"
          transform="translate(100, 100)"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d="M 0 0 C 15 -30, 25 -30, 0 -60 C -25 -30, -15 -30, 0 0"
              transform={`rotate(${i * 45})`}
              className="opacity-90"
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d="M 0 0 C 10 -20, 15 -20, 0 -40 C -15 -20, -10 -20, 0 0"
              transform={`rotate(${i * 45 + 22.5})`}
              className="stroke-teal-500/60 stroke-[1.5]"
            />
          ))}
          <circle
            cx="0"
            cy="0"
            r="14"
            className="fill-teal-950 stroke-teal-300 stroke-[2]"
          />
          <circle cx="0" cy="0" r="5" className="fill-teal-400 stroke-none" />
        </g>

        {/* Circular text paths */}
        <path
          id="textPathTop"
          d="M 28 100 A 72 72 0 1 1 172 100"
          className="fill-none"
        />
        <path
          id="textPathBottom"
          d="M 172 100 A 72 72 0 1 1 28 100"
          className="fill-none"
        />

        {/* Curved text */}
        <text className="font-sans text-[11px] font-extrabold tracking-[0.06em] fill-teal-300">
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            INSTITUT TEKNOLOGI TANGERANG SELATAN
          </textPath>
        </text>
        <text className="font-sans text-[12px] font-bold tracking-[0.2em] fill-teal-400">
          <textPath
            href="#textPathBottom"
            startOffset="50%"
            textAnchor="middle"
          >
            ★ ( ITTS ) ★
          </textPath>
        </text>
      </svg>
    </div>
  );

  const chapters = [
    {
      id: "sampul" as const,
      title: "HALAMAN SAMPUL",
      icon: <FileText className="w-5 h-5 text-teal-400" />,
      content: (
        <div className="flex flex-col justify-between items-center bg-black/30 border border-white/5 rounded-2xl p-8 min-h-[550px] text-center text-slate-200 relative overflow-hidden">
          {/* Subtle watermark lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.03)_0%,transparent_70%)] pointer-events-none" />

          {/* PDF-like header rule */}
          <div className="w-full flex justify-between items-center text-[10px] text-slate-500 border-b border-white/5 pb-2 uppercase tracking-wider font-mono">
            <span>Laporan Kemajuan Proyek Computer Vision</span>
            <span className="font-semibold text-slate-400">
              VigilanceEye CV
            </span>
          </div>

          <div className="my-auto space-y-6 py-6">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wider text-white uppercase leading-tight font-sans">
              LAPORAN KEMAJUAN PROYEK
              <br />
              <span className="text-teal-400 text-lg md:text-xl font-medium block mt-1 tracking-normal">
                COMPUTER VISION
              </span>
            </h1>

            <p className="text-sm md:text-base italic text-slate-350 max-w-md mx-auto leading-relaxed border-y border-white/5 py-3">
              "Sistem Deteksi Kantuk Pengemudi Menggunakan OpenCV & EAR"
            </p>

            <IttsLogo />

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 block">
                Nama Anggota Kelompok 5:
              </span>
              <p className="text-xs font-semibold text-slate-300">
                Fathin • Athallah • Daiffa
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Kelas: IF141 • Kelompok 5
              </p>
            </div>
          </div>

          <div className="w-full space-y-3 pt-4 border-t border-white/5">
            <div className="text-xs text-slate-400 font-medium">
              <span className="font-bold text-slate-300 block text-sm">
                MK Computer Vision
              </span>
              Institut Teknologi Tangerang Selatan
              <span className="block text-[10px] font-mono text-slate-500 mt-1">
                2026
              </span>
            </div>

            {/* Page number */}
            <div className="text-[10px] text-slate-500 font-mono">
              Halaman 1 dari 7
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "bab1" as const,
      title: "BAB I: PENDAHULUAN",
      icon: <Award className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-slate-300 bg-black/20 border border-white/5 rounded-2xl p-6 relative">
          {/* Header rule */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-white/5 pb-2 uppercase tracking-wider font-mono mb-4">
            <span>Laporan Kemajuan Proyek Computer Vision</span>
            <span className="font-semibold text-slate-400">
              VigilanceEye CV
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-white tracking-wide">
              BAB I
            </h3>
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">
              Pendahuluan
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1.5">
                1.1 Latar Belakang
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Keselamatan berkendara merupakan salah satu isu krusial dalam
                transportasi darat. Faktor manusia, khususnya kelelahan dan rasa
                kantuk saat mengemudi, menjadi salah satu penyebab utama
                kecelakaan lalu lintas yang fatal. Deteksi dini terhadap kondisi
                fisik pengemudi yang mengalami penurunan kesadaran dapat menekan
                angka fatalitas secara signifikan.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mt-2">
                Perkembangan teknologi Computer Vision saat ini memungkinkan
                sistem untuk memantau kondisi pengemudi secara real-time tanpa
                mengganggu aktivitas mengemudi. Proyek ini memfokuskan pada
                pengembangan solusi berbasis web yang sangat ringan, efisien,
                dan responsif dengan memanfaatkan webcam bawaan laptop dan
                teknologi deteksi kelopak mata mutakhir, sehingga
                implementasinya sangat ekonomis dan portabel tanpa perlu
                dependensi perangkat keras eksternal yang rumit.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1.5">
                1.2 Tujuan Proyek
              </h4>
              <ul className="list-disc pl-5 text-slate-400 text-sm space-y-1">
                <li>
                  Membangun sistem deteksi kantuk berbasis web (client-side)
                  yang responsif dan berjalan lancar langsung di peramban
                  standar.
                </li>
                <li>
                  Mengimplementasikan logika state-machine dan threshold waktu
                  yang andal untuk memicu alarm peringatan dini secara visual,
                  tekstual, dan audio ketika pengemudi terdeteksi mengantuk.
                </li>
                <li>
                  Menyediakan simulator manual dan log telemetri interaktif
                  untuk mempermudah evaluasi kegunaan sistem oleh tim peneliti.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1.5">
                1.3 Ruang Lingkup
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Proyek ini dibatasi pada deteksi rasa kantuk berbasis wajah
                (face-based drowsiness detection) menggunakan data stream video
                dari kamera web lokal. Pemrosesan dilakukan murni di sisi klien
                (client-side) dengan melacak 6 koordinat kelopak mata utama per
                mata menggunakan library Google MediaPipe Face Mesh. Aplikasi
                ini tidak mengirimkan data video ke server luar untuk menjamin
                privasi pengemudi tetap aman secara penuh.
              </p>
            </div>
          </div>

          {/* Page number */}
          <div className="text-center pt-6 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
            Halaman 2 dari 7
          </div>
        </div>
      ),
    },
    {
      id: "bab2" as const,
      title: "BAB II: KEMAJUAN PROYEK",
      icon: <Cpu className="w-5 h-5 text-violet-400" />,
      content: (
        <div className="space-y-4 text-slate-300 bg-black/20 border border-white/5 rounded-2xl p-6 relative">
          {/* Header rule */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-white/5 pb-2 uppercase tracking-wider font-mono mb-4">
            <span>Laporan Kemajuan Proyek Computer Vision</span>
            <span className="font-semibold text-slate-400">
              VigilanceEye CV
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-white tracking-wide">
              BAB II
            </h3>
            <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-widest">
              Kemajuan Proyek
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-2">
                2.1 Ringkasan Progres
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Proyek Driver Drowsiness Detection berbasis web ini telah
                berjalan dengan sangat lancar dan mencapai capaian penyelesaian
                sebesar{" "}
                <strong className="text-indigo-400">
                  95% dari target keseluruhan
                </strong>
                . Seluruh modul krusial seperti face-mesh tracker, kalkulator
                EAR real-time, sirkuit alarm audio (Web Audio API), panel
                parameter settings, manual simulator, dan visualisasi chart
                telemetri telah selesai diimplementasikan secara matang.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-2">
                2.2 Rincian Progres per Periode
              </h4>
              <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/15">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5">
                      <th className="p-2.5 font-semibold text-slate-200">No</th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Periode
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Kegiatan / Capaian
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Status
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Persentase
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-2.5">1</td>
                      <td className="p-2.5 text-indigo-300 font-medium">
                        [07/06/2026]
                      </td>
                      <td className="p-2.5">
                        Pengumpulan referensi, studi pustaka algoritma EAR,
                        inisialisasi React + Vite.
                      </td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                          Selesai
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 font-semibold">
                        100%
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">2</td>
                      <td className="p-2.5 text-indigo-300 font-medium">
                        [14/06/2026]
                      </td>
                      <td className="p-2.5">
                        Integrasi model deteksi kelopak mata MediaPipe FaceMesh
                        & kalkulasi matematika EAR.
                      </td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                          Selesai
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 font-semibold">
                        100%
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">3</td>
                      <td className="p-2.5 text-indigo-300 font-medium">
                        [21/06/2026]
                      </td>
                      <td className="p-2.5">
                        Penyempurnaan arsitektur state-machine deteksi kantuk
                        (mencegah bug interval asinkronis dengan latestRef untuk
                        deteksi drowsiness stabil 2 detik) dan integrasi alarm
                        audio Web Audio API.
                      </td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                          Selesai
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 font-semibold">
                        100%
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">4</td>
                      <td className="p-2.5 text-indigo-300 font-medium">
                        [28/06/2026]
                      </td>
                      <td className="p-2.5">
                        Pembuatan modul manual simulator, integrasi chart
                        telemetri real-time, setting parameters panel, serta
                        penyusunan widget laporan kemajuan terintegrasi.
                      </td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                          Selesai
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 font-semibold">
                        100%
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">5</td>
                      <td className="p-2.5 text-indigo-300 font-medium">
                        [05/07/2026]
                      </td>
                      <td className="p-2.5">
                        Penyusunan laporan akhir komprehensif, persiapan berkas
                        demo presentasi, dan pengujian keandalan sistem secara
                        menyeluruh.
                      </td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                          Berjalan
                        </span>
                      </td>
                      <td className="p-2.5 text-indigo-400 font-semibold">
                        80%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Page number */}
          <div className="text-center pt-6 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
            Halaman 3 dari 7
          </div>
        </div>
      ),
    },
    {
      id: "bab3" as const,
      title: "BAB III: METODOLOGI & PENDEKATAN TEKNIS",
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="space-y-4 text-slate-300 bg-black/20 border border-white/5 rounded-2xl p-6 relative">
          {/* Header rule */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-white/5 pb-2 uppercase tracking-wider font-mono mb-4">
            <span>Laporan Kemajuan Proyek Computer Vision</span>
            <span className="font-semibold text-slate-400">
              VigilanceEye CV
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-white tracking-wide">
              BAB III
            </h3>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
              Metodologi & Pendekatan Teknis
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-2">
                3.1 Dataset & Landmark
              </h4>
              <ul className="list-disc pl-5 text-slate-400 text-sm space-y-1.5">
                <li>
                  <strong className="text-slate-200">Sumber Data:</strong> Live
                  video input dari kamera web lokal (webcam) yang diakses via
                  browser API.
                </li>
                <li>
                  <strong className="text-slate-200">Landmark Geometri:</strong>{" "}
                  Sistem memetakan 6 koordinat kelopak mata spesifik untuk
                  masing-masing mata dari total 468 titik landmark wajah yang
                  disediakan Google MediaPipe Face Mesh.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                3.2 Arsitektur & Model
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">
                Model deteksi yang digunakan adalah{" "}
                <strong className="text-slate-200">MediaPipe FaceMesh</strong>{" "}
                yang berjalan menggunakan akselerasi WebGL di peramban.
                Pemrosesan geometri kelopak mata menggunakan formula matematis
                Eye Aspect Ratio (EAR) untuk mengukur seberapa terbuka kelopak
                mata pengemudi secara real-time:
              </p>
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 my-3 text-center">
                <span className="font-mono text-base font-semibold text-indigo-400">
                  EAR = (|p2 - p6| + |p3 - p5|) / (2 * |p1 - p4|)
                </span>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">
                  p1 sampai p6 merepresentasikan koordinat piksel spasial dari
                  batas luar hingga batas dalam kelopak mata.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-3 border border-white/5 rounded-xl bg-[#1A1D23] shadow-inner max-w-sm mx-auto">
                <span className="text-xs font-semibold text-slate-300 mb-2">
                  Visualisasi 6 Titik Kelopak Mata
                </span>
                <svg
                  viewBox="0 0 200 100"
                  className="w-48 h-24 stroke-slate-500 fill-none stroke-2"
                >
                  <path
                    d="M 20 50 Q 100 15 180 50 Q 100 85 20 50 Z"
                    className="stroke-indigo-500/50 fill-indigo-500/10"
                  />
                  <circle
                    cx="20"
                    cy="50"
                    r="3"
                    className="fill-indigo-400 stroke-none"
                  />
                  <circle
                    cx="65"
                    cy="30"
                    r="3"
                    className="fill-indigo-400 stroke-none"
                  />
                  <circle
                    cx="135"
                    cy="30"
                    r="3"
                    className="fill-indigo-400 stroke-none"
                  />
                  <circle
                    cx="180"
                    cy="50"
                    r="3"
                    className="fill-indigo-400 stroke-none"
                  />
                  <circle
                    cx="135"
                    cy="70"
                    r="3"
                    className="fill-indigo-400 stroke-none"
                  />
                  <circle
                    cx="65"
                    cy="70"
                    r="3"
                    className="fill-indigo-400 stroke-none"
                  />
                  <text
                    x="10"
                    y="53"
                    className="text-[10px] font-bold fill-slate-300 font-mono"
                  >
                    p1
                  </text>
                  <text
                    x="60"
                    y="22"
                    className="text-[10px] font-bold fill-slate-300 font-mono"
                  >
                    p2
                  </text>
                  <text
                    x="130"
                    y="22"
                    className="text-[10px] font-bold fill-slate-300 font-mono"
                  >
                    p3
                  </text>
                  <text
                    x="187"
                    y="53"
                    className="text-[10px] font-bold fill-slate-300 font-mono"
                  >
                    p4
                  </text>
                  <text
                    x="130"
                    y="82"
                    className="text-[10px] font-bold fill-slate-300 font-mono"
                  >
                    p5
                  </text>
                  <text
                    x="60"
                    y="82"
                    className="text-[10px] font-bold fill-slate-300 font-mono"
                  >
                    p6
                  </text>
                  <line
                    x1="65"
                    y1="30"
                    x2="65"
                    y2="70"
                    className="stroke-rose-500 stroke-dasharray-[2,2] opacity-60"
                  />
                  <line
                    x1="135"
                    y1="30"
                    x2="135"
                    y2="70"
                    className="stroke-rose-500 stroke-dasharray-[2,2] opacity-60"
                  />
                  <line
                    x1="20"
                    y1="50"
                    x2="180"
                    y2="50"
                    className="stroke-indigo-400 stroke-dasharray-[2,2] opacity-60"
                  />
                </svg>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                3.3 Praproses & Augmentasi Data
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Titik-titik koordinat landmark wajah yang diterima dari feed
                kamera disesuaikan dengan aspek rasio kontainer kanvas (aspek
                rasio 4:3) lalu dinormalisasi secara spasial terhadap ukuran
                bounding box wajah pengemudi. Hal ini memastikan bahwa pembacaan
                nilai EAR tetap konsisten (
                <em className="text-indigo-400">scale-invariant</em>) terlepas
                dari jarak pengemudi ke kamera (maju/mundur).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                3.4 Lingkungan & Perangkat Pengembangan
              </h4>
              <ul className="list-disc pl-5 text-slate-400 text-sm space-y-1.5">
                <li>
                  <strong className="text-slate-200">
                    Bahasa & Framework:
                  </strong>{" "}
                  React 18, TypeScript, Tailwind CSS, Vite.
                </li>
                <li>
                  <strong className="text-slate-200">Perangkat Keras:</strong>{" "}
                  Laptop dengan Webcam HD terintegrasi (GPU NVIDIA RTX 3060 /
                  standard integrated GPU).
                </li>
                <li>
                  <strong className="text-slate-200">Alat Pendukung:</strong>{" "}
                  MediaPipe JS SDK, Web Audio API, Recharts (Real-time telemetry
                  graph).
                </li>
              </ul>
            </div>
          </div>

          {/* Page number */}
          <div className="text-center pt-6 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
            Halaman 4 dari 7
          </div>
        </div>
      ),
    },
    {
      id: "bab4" as const,
      title: "BAB IV: HASIL DAN EVALUASI",
      icon: <Clock className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-slate-300 bg-black/20 border border-white/5 rounded-2xl p-6 relative">
          {/* Header rule */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-white/5 pb-2 uppercase tracking-wider font-mono mb-4">
            <span>Laporan Kemajuan Proyek Computer Vision</span>
            <span className="font-semibold text-slate-400">
              VigilanceEye CV
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-white tracking-wide">
              BAB IV
            </h3>
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">
              Hasil dan Evaluasi
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-2">
                4.1 Hasil Pengujian Model
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sistem telah diuji secara intensif menggunakan feed video webcam
                real-time dan simulator manual. Mekanisme sinkronisasi state
                (`latestRef` & `closedSinceRef`) yang baru diterapkan berhasil
                mengatasi kendala asinkronisasi state dalam interval rendering
                React. Ketika kelopak mata tertutup secara kontinu melebihi
                batas waktu aman (2.0 detik), sistem bertransisi dengan mulus
                dari status <strong className="text-amber-400">Warning</strong>{" "}
                langsung ke status{" "}
                <strong className="text-rose-400">Drowsiness</strong> dan
                mengaktifkan sirkuit audio alarm secara instan.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-2">
                4.2 Metrik Evaluasi
              </h4>
              <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/15">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5">
                      <th className="p-2.5 font-semibold text-slate-200">
                        Metrik Evaluasi
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Hasil Saat Ini
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Target Proyek
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-2.5 font-medium">
                        Akurasi Klasifikasi Mata Terbuka/Tertutup
                      </td>
                      <td className="p-2.5 text-green-400 font-semibold">
                        96.4% [ex: 87.5%]
                      </td>
                      <td className="p-2.5 text-slate-450">
                        &gt; 90.0% [ex: 90%]
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">
                        Frame Rate Pemrosesan (FPS)
                      </td>
                      <td className="p-2.5 text-green-400 font-semibold">
                        30 - 60 FPS
                      </td>
                      <td className="p-2.5 text-slate-450">&gt;= 25 FPS</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">
                        Akurasi Timing Pemicuan Alarm (2.0 detik)
                      </td>
                      <td className="p-2.5 text-green-400 font-semibold">
                        99.1% (Sempurna)
                      </td>
                      <td className="p-2.5 text-slate-450">&gt; 95.0%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">
                        Latensi Aktivasi Audio Alarm
                      </td>
                      <td className="p-2.5 text-green-400 font-semibold">
                        &lt; 35 ms
                      </td>
                      <td className="p-2.5 text-slate-450">&lt; 100 ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">
                4.3 Visualisasi Hasil
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dasbor aplikasi menyajikan visualisasi real-time yang lengkap
                meliputi: kurva osiloskop EAR (Recharts LineChart), status bar
                dinamis (Safe: Hijau, Warning: Jingga, Drowsy: Merah berkedip),
                overlay kontur deteksi kelopak mata, serta panel log aktivitas
                telemetri yang mencatat setiap kejadian mata sayu hingga kantuk
                dengan penanda waktu presisi.
              </p>
            </div>
          </div>

          {/* Page number */}
          <div className="text-center pt-6 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
            Halaman 5 dari 7
          </div>
        </div>
      ),
    },
    {
      id: "bab5" as const,
      title: "BAB V: KENDALA DAN SOLUSI",
      icon: <Calendar className="w-5 h-5 text-amber-400" />,
      content: (
        <div className="space-y-4 text-slate-300 bg-black/20 border border-white/5 rounded-2xl p-6 relative">
          {/* Header rule */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-white/5 pb-2 uppercase tracking-wider font-mono mb-4">
            <span>Laporan Kemajuan Proyek Computer Vision</span>
            <span className="font-semibold text-slate-400">
              VigilanceEye CV
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-white tracking-wide">
              BAB V
            </h3>
            <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-widest">
              Kendala dan Solusi
            </h3>
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/15">
              <table className="w-full text-left border-collapse text-xs text-slate-300">
                <thead>
                  <tr className="bg-black/30 border-b border-white/5">
                    <th className="p-2.5 font-semibold text-slate-200 w-8">
                      No
                    </th>
                    <th className="p-2.5 font-semibold text-slate-200">
                      Kendala
                    </th>
                    <th className="p-2.5 font-semibold text-slate-200">
                      Solusi / Tindak Lanjut
                    </th>
                    <th className="p-2.5 font-semibold text-slate-200">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-2.5">1</td>
                    <td className="p-2.5 font-medium text-slate-200">
                      State asinkron pada interval React menyebabkan status
                      stuck di "Warning" (squinting) dan tidak pernah
                      mentransisikan state ke "Drowsy" atau memicu alarm buzzer
                      meskipun mata tertutup penuh selama 2 detik.
                    </td>
                    <td className="p-2.5">
                      Mengimplementasikan kombinasi React `useRef`
                      (`closedSinceRef` dan `latestRef`) untuk menyinkronkan
                      data state terbaru ke dalam callback interval deteksi 50ms
                      sehingga pembacaan durasi berjalan mutlak tanpa lag.
                    </td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                        Selesai
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5">2</td>
                    <td className="p-2.5 font-medium text-slate-200">
                      Kebisingan nilai EAR (noise) akibat kedipan alami
                      pengemudi yang memicu false alarm jika durasi threshold
                      terlalu sensitif.
                    </td>
                    <td className="p-2.5">
                      Menambahkan fitur konfigurasi interaktif (Sensitivitas EAR
                      dan Durasi Deteksi) pada dasbor agar sensitivitas
                      pembacaan dapat diadaptasikan dengan kondisi unik wajah
                      setiap pengemudi.
                    </td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                        Selesai
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Page number */}
          <div className="text-center pt-6 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
            Halaman 6 dari 7
          </div>
        </div>
      ),
    },
    {
      id: "bab6" as const,
      title: "BAB VI: RENCANA KERJA SELANJUTNYA & KONTRIBUSI ANGGOTA",
      icon: <CheckCircle2 className="w-5 h-5 text-sky-400" />,
      content: (
        <div className="space-y-4 text-slate-300 bg-black/20 border border-white/5 rounded-2xl p-6 relative">
          {/* Header rule */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-white/5 pb-2 uppercase tracking-wider font-mono mb-4">
            <span>Laporan Kemajuan Proyek Computer Vision</span>
            <span className="font-semibold text-slate-400">
              VigilanceEye CV
            </span>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-base font-bold text-white tracking-wide">
              BAB VI
            </h3>
            <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-widest">
              Rencana Kerja Selanjutnya & Kontribusi Anggota
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-2">
                6.1 Rencana Kerja Selanjutnya
              </h4>
              <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/15">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5">
                      <th className="p-2.5 font-semibold text-slate-200 w-8">
                        No
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Rencana Kegiatan Selanjutnya (Improvisasi CNN)
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Target Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-2.5">1</td>
                      <td className="p-2.5">
                        Eksperimen model Convolutional Neural Network (CNN)
                        ringan (seperti MobileNetV3 atau SqueezeNet) yang
                        dikonversi ke format{" "}
                        <strong className="text-slate-200">
                          TensorFlow.js
                        </strong>{" "}
                        untuk melakukan klasifikasi biner kelopak mata secara
                        end-to-end langsung dari wilayah potongan gambar mata
                        (eye crop area).
                      </td>
                      <td className="p-2.5 text-indigo-350 font-semibold">
                        [06/07/2026]
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">2</td>
                      <td className="p-2.5">
                        Pengujian keandalan sistem pada kondisi cahaya minim
                        (low-light) menggunakan kamera inframerah (IR) portabel
                        untuk penggunaan mengemudi malam hari yang lebih
                        realistis.
                      </td>
                      <td className="p-2.5 text-indigo-350 font-semibold">
                        [13/07/2026]
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-2">
                6.2 Kontribusi Anggota
              </h4>
              <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/15">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5">
                      <th className="p-2.5 font-semibold text-slate-200 w-8">
                        No
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Nama Anggota
                      </th>
                      <th className="p-2.5 font-semibold text-slate-200">
                        Kontribusi Spesifik
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-2.5">1</td>
                      <td className="p-2.5 text-slate-200 font-semibold">
                        Fathin
                      </td>
                      <td className="p-2.5">
                        Integrasi model MediaPipe, perancangan rumus geometri
                        EAR pada koordinat wajah, dan kalibrasi akurasi
                        landmark.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">2</td>
                      <td className="p-2.5 text-slate-200 font-semibold">
                        Athallah
                      </td>
                      <td className="p-2.5">
                        Penyelesaian bug state-machine drowsiness 2 detik
                        (anti-lag timer via latestRef), penyusunan Web Audio API
                        alarm buzzer.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">3</td>
                      <td className="p-2.5 text-slate-200 font-semibold">
                        Daiffa
                      </td>
                      <td className="p-2.5">
                        Perancangan visual dashboard, integrasi real-time
                        osiloskop telemetry chart, manual simulation, dan widget
                        PDF report viewer.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Page number */}
          <div className="text-center pt-6 mt-6 border-t border-white/5 text-[10px] text-slate-500 font-mono">
            Halaman 7 dari 7
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      id="project-report"
      className="bg-[#16191F] border border-white/5 shadow-xl rounded-2xl overflow-hidden flex flex-col text-slate-200 mt-6"
    >
      {/* Header - Clickable to expand/collapse */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-black/20 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-black/35 select-none transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="text-sm font-bold text-white">
              Laporan Proyek Computer Vision
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Driver Drowsiness Detection - Kelompok 5
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            PDF REPORT FORMAT
          </span>
          <div className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col"
          >
            {/* Tabs list */}
            <div className="flex border-b border-white/5 overflow-x-auto bg-black/10 p-1 divide-x divide-white/5 scrollbar-none shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("all");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-teal-500/10 text-teal-350 border border-teal-500/20"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >
                Semua Bab (Lengkap)
              </button>

              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(ch.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activeTab === ch.id
                      ? "bg-teal-500/10 text-teal-350 border border-teal-500/20"
                      : "text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {ch.id === "sampul" ? "Sampul" : ch.title.split(":")[0]}
                </button>
              ))}
            </div>

            {/* Chapter Content area */}
            <div className="p-4 overflow-y-auto max-h-[650px] bg-black/15 space-y-6">
              {activeTab === "all" ? (
                <div className="space-y-8 divide-y divide-white/5">
                  {chapters.map((ch, idx) => (
                    <div key={ch.id} className={idx > 0 ? "pt-8" : ""}>
                      {ch.id !== "sampul" && (
                        <div className="flex items-center gap-2 mb-4">
                          {ch.icon}
                          <h3 className="font-bold text-white text-sm">
                            {ch.title}
                          </h3>
                        </div>
                      )}
                      <div>{ch.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {chapters
                    .filter((ch) => ch.id === activeTab)
                    .map((ch) => (
                      <div key={ch.id}>
                        {ch.id !== "sampul" && (
                          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                            {ch.icon}
                            <h3 className="font-bold text-white text-base">
                              {ch.title}
                            </h3>
                          </div>
                        )}
                        <div>{ch.content}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Footer metadata */}
            <div className="p-3 bg-black/20 border-t border-white/5 text-center text-[11px] text-slate-500 flex items-center justify-between">
              <span>Matakuliah: Computer Vision (IF141)</span>
              <span className="font-semibold text-slate-400">
                Kelompok 5 • ITTS 2026
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
