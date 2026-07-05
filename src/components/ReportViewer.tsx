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
  FileUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReportViewerProps {}

export default function ReportViewer({}: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "bab1" | "bab2" | "bab3" | "bab4" | "bab5"
  >("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const chapters = [
    {
      id: "bab1" as const,
      title: "BAB I: PENDAHULUAN",
      icon: <Award className="w-5 h-5 text-indigo-400" />,
      content: (
        <div className="space-y-4 text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
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
              pengembangan aplikasi berbasis web yang sangat ringan, efisien,
              dan responsif dengan memanfaatkan webcam bawaan laptop dan
              teknologi deteksi wajah mutakhir, sehingga implementasinya sangat
              ekonomis dan portabel.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              1.2 Rumusan Masalah
            </h4>
            <ol className="list-decimal pl-5 text-slate-400 text-sm space-y-1">
              <li>
                Bagaimana cara mendeteksi area wajah dan melacak koordinat
                kelopak mata secara real-time menggunakan Web API dan library
                browser?
              </li>
              <li>
                Bagaimana menerapkan algoritma Eye Aspect Ratio (EAR) untuk
                mengukur durasi mata tertutup secara presisi tanpa lag atau
                masalah asinkronisasi state?
              </li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              1.3 Tujuan Proyek
            </h4>
            <ol className="list-decimal pl-5 text-slate-400 text-sm space-y-1">
              <li>
                Membangun sistem deteksi kantuk berbasis web (client-side) yang
                responsif dan berjalan lancar langsung di peramban standar.
              </li>
              <li>
                Mengimplementasikan logika state-machine dan threshold waktu
                yang andal untuk memicu alarm peringatan dini secara visual,
                tekstual, dan audio (synthesized buzzer) ketika pengemudi
                terdeteksi mengantuk.
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "bab2" as const,
      title: "BAB II: LANDASAN TEORI & METODOLOGI",
      icon: <Cpu className="w-5 h-5 text-violet-400" />,
      content: (
        <div className="space-y-4 text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              2.1 Pustaka dan Perangkat Lunak
            </h4>
            <ul className="list-disc pl-5 text-slate-400 text-sm space-y-2">
              <li>
                <strong className="text-slate-200">React & TypeScript:</strong>{" "}
                Bahasa pemrograman berkepribadian tinggi yang aman (type-safe)
                dan arsitektur UI berbasis komponen modular yang reaktif.
              </li>
              <li>
                <strong className="text-slate-200">MediaPipe Face Mesh:</strong>{" "}
                Model deep learning ringan dari Google yang mampu melacak 468+
                titik landmark wajah secara real-time langsung di sisi klien.
              </li>
              <li>
                <strong className="text-slate-200">
                  HTML5 Canvas & Web Audio API:
                </strong>{" "}
                Digunakan untuk merender visualisasi geometri mata pengemudi
                secara presisi serta memicu audio buzzer berfrekuensi tinggi
                secara langsung sebagai alarm peringatan.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              2.2 Metode Perhitungan Eye Aspect Ratio (EAR)
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Sistem ini menggunakan algoritma berbasis matematika untuk
              menentukan apakah mata dalam keadaan terbuka atau tertutup.
              Formula EAR menghitung rasio perbandingan antara jarak vertikal
              kelopak mata dengan jarak horizontalnya. Persamaan matematis yang
              digunakan adalah sebagai berikut:
            </p>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 my-3 text-center">
              <span className="font-mono text-base font-semibold text-indigo-400">
                EAR = (|p2 - p6| + |p3 - p5|) / (2 * |p1 - p4|)
              </span>
              <p className="text-xs text-slate-500 mt-2">
                Di mana p1 sampai p6 adalah 6 koordinat kelopak mata yang
                dideteksi oleh landmark wajah.
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
                {/* Eye contour */}
                <path
                  d="M 20 50 Q 100 15 180 50 Q 100 85 20 50 Z"
                  className="stroke-indigo-500/50 fill-indigo-500/10"
                />
                {/* Points */}
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
                {/* Labels */}
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
                {/* Vertical distance lines */}
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
                {/* Horizontal distance line */}
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
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              2.3 Alur Kerja Sistem (Workflow)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs mt-2">
              {[
                {
                  step: "1",
                  title: "Stream Kamera",
                  desc: "Aktivasi input webcam browser",
                },
                {
                  step: "2",
                  title: "Landmark Tracking",
                  desc: "MediaPipe melacak mata",
                },
                {
                  step: "3",
                  title: "Kalkulasi EAR",
                  desc: "Rasio vertikal & horizontal",
                },
                {
                  step: "4",
                  title: "Pencegahan Lag",
                  desc: "Sinkronisasi via latestRef",
                },
                {
                  step: "5",
                  title: "Memicu Alarm",
                  desc: "Peringatan visual & buzzer suara",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 border border-white/5 rounded-xl bg-black/20 flex flex-col items-center"
                >
                  <span className="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mb-1 text-[10px]">
                    {item.step}
                  </span>
                  <span className="font-semibold text-slate-200 text-[11px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "bab3" as const,
      title: "BAB III: RANCANGAN IMPLEMENTASI",
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="space-y-4 text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-2">
              3.1 Kebutuhan Sistem
            </h4>
            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full text-left border-collapse text-xs text-slate-300">
                <thead>
                  <tr className="bg-black/30 border-b border-white/5">
                    <th className="p-2.5 font-semibold text-slate-200">
                      Kategori
                    </th>
                    <th className="p-2.5 font-semibold text-slate-200">
                      Komponen
                    </th>
                    <th className="p-2.5 font-semibold text-slate-200">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-200">
                      Perangkat Keras
                    </td>
                    <td className="p-2.5 text-slate-300">
                      Webcam Laptop / Eksternal
                    </td>
                    <td className="p-2.5 text-slate-400">
                      Minimal menangkap video beresolusi HD untuk pelacakan
                      optimal.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-200">
                      Perangkat Lunak
                    </td>
                    <td className="p-2.5">Web Browser Modern</td>
                    <td className="p-2.5 text-slate-400">
                      Google Chrome, Edge, Firefox, atau Safari dengan dukungan
                      WebGL & Web Audio.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-200">
                      Bahasa & IDE
                    </td>
                    <td className="p-2.5 text-slate-300">TypeScript & Vite</td>
                    <td className="p-2.5 text-slate-400">
                      Menyediakan transpilasi cepat, efisiensi modulasi, dan
                      keamanan tipe data.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-200">
                      Algoritma Vision
                    </td>
                    <td className="p-2.5 text-slate-300">MediaPipe FaceMesh</td>
                    <td className="p-2.5 text-slate-400">
                      Mendeteksi 6 titik utama di area kelopak mata pengemudi
                      secara presisi.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              3.2 Indikator Logika Program
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-200">Kondisi Normal:</strong>{" "}
                  Nilai EAR &gt; Batas Ambang (misal: 0.22) &rarr; Status:{" "}
                  <span className="font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded text-xs">
                    "Safe / Segar"
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-200">
                    Kondisi Peringatan:
                  </strong>{" "}
                  Nilai EAR &lt; Batas Ambang (mata sayu / berkedip) &rarr;
                  Status:{" "}
                  <span className="font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-xs">
                    "Warning"
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-200">
                    Kondisi Mengantuk (Drowsiness):
                  </strong>{" "}
                  Nilai EAR berada di bawah ambang batas secara kontinu melebihi
                  durasi aman (misal: 2 detik) &rarr; Status:{" "}
                  <span className="font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded text-xs">
                    "Drowsiness Detected!"
                  </span>
                  . Memicu bunyi alarm audio buzzer berkelanjutan.
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "bab4" as const,
      title: "BAB IV: JADWAL PELAKSANAAN PROYEK",
      icon: <Calendar className="w-5 h-5 text-amber-400" />,
      content: (
        <div className="space-y-4 text-slate-300">
          <div className="overflow-x-auto border border-white/5 rounded-xl">
            <table className="w-full text-left border-collapse text-xs text-slate-300">
              <thead>
                <tr className="bg-black/30 border-b border-white/5">
                  <th className="p-2.5 font-semibold text-slate-200 w-24">
                    Waktu
                  </th>
                  <th className="p-2.5 font-semibold text-slate-200">
                    Kegiatan
                  </th>
                  <th className="p-2.5 font-semibold text-slate-200">
                    Output / Target
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-2.5 font-semibold text-indigo-400">
                    Minggu 1
                  </td>
                  <td className="p-2.5">
                    Studi literatur, riset model deteksi wajah client-side,
                    inisialisasi framework React + TypeScript.
                  </td>
                  <td className="p-2.5 text-slate-400">
                    Struktur proyek terbentuk dengan performa bundling optimal
                    via Vite.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-indigo-400">
                    Minggu 2
                  </td>
                  <td className="p-2.5">
                    Integrasi model MediaPipe Face Mesh, kalkulasi matematis EAR
                    secara real-time.
                  </td>
                  <td className="p-2.5 text-slate-400">
                    Pelacakan mata pengemudi dan pencatatan nilai EAR berjalan
                    lancar.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-indigo-400">
                    Minggu 3
                  </td>
                  <td className="p-2.5">
                    Penerapan latestRef state-syncer untuk mencegah stale
                    closures dan bug timing deteksi kantuk 2 detik. Integrasi
                    audio alarm buzzer.
                  </td>
                  <td className="p-2.5 text-slate-400">
                    Aplikasi deteksi kantuk bekerja akurat dan responsif tanpa
                    lag.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-indigo-400">
                    Minggu 4
                  </td>
                  <td className="p-2.5">
                    Penyusunan modul visualisasi laporan (PDF Report) dalam
                    aplikasi, dokumentasi kode, dan demo presentasi.
                  </td>
                  <td className="p-2.5 text-slate-400">
                    Sistem selesai sepenuhnya dengan antarmuka futuristik
                    terintegrasi.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "bab5" as const,
      title: "BAB V: KESIMPULAN & SARAN PENGEMBANGAN",
      icon: <CheckCircle2 className="w-5 h-5 text-sky-400" />,
      content: (
        <div className="space-y-4 text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              5.1 Kesimpulan
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Proyek pengembangan sistem Driver Drowsiness Detection berbasis
              web ini berhasil direalisasikan menggunakan arsitektur modern
              berbasis TypeScript, React, dan Google MediaPipe Face Mesh. Sistem
              ini membuktikan bahwa deteksi kantuk real-time berkepribadian
              tinggi tidak memerlukan instalasi runtime Python lokal atau
              dependensi berat seperti C++ compiler / CMake / Dlib.
            </p>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
            <strong>Kesimpulan Utama:</strong> Integrasi pemrosesan vision di
            sisi klien (client-side processing) menggunakan MediaPipe dan
            visualisasi interaktif pada aplikasi web ini menghasilkan waktu
            respons instan, hemat bandwidth, mandiri secara platform, serta
            menjamin privasi video pengemudi tetap aman di perangkat lokal.
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 text-sm mb-1">
              5.2 Saran & Improvisasi Masa Depan (Rencana CNN)
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Untuk meningkatkan keandalan sistem dalam berbagai skenario
              ekstrem, beberapa improvisasi yang sangat direkomendasikan untuk
              pengembangan selanjutnya adalah:
            </p>
            <ul className="list-disc pl-5 mt-2 text-slate-400 text-sm space-y-2">
              <li>
                <strong className="text-slate-200">
                  Integrasi Convolutional Neural Network (CNN) Custom:
                </strong>{" "}
                Dibandingkan algoritma geometri EAR konvensional yang sensitif
                terhadap sudut kemiringan wajah (head tilt) dan kondisi cahaya,
                penggunaan model CNN ringan (seperti MobileNetV3 atau
                SqueezeNet) yang di-compile ke format{" "}
                <strong className="text-slate-200">TensorFlow.js</strong> akan
                sangat membantu.
              </li>
              <li>
                <strong className="text-slate-200">
                  Klasifikasi Piksel Langsung (End-to-End Classification):
                </strong>{" "}
                CNN dapat dilatih khusus untuk melakukan klasifikasi klasifikasi
                biner (
                <em className="text-slate-300">Eye Open vs. Eye Closed</em>)
                langsung dari area potongan gambar mata (eye crop region) yang
                diekstrak oleh pemetakan MediaPipe, meningkatkan akurasi hingga
                di atas 98% bahkan ketika pengguna menggunakan kacamata.
              </li>
              <li>
                <strong className="text-slate-200">
                  Adaptasi Pencahayaan Inframerah (IR):
                </strong>{" "}
                Mengintegrasikan sensor kamera dengan pencahayaan inframerah
                pasif agar deteksi mata tetap bekerja maksimal pada kondisi
                berkendara malam hari tanpa cahaya kabin.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#16191F] border border-white/5 shadow-xl rounded-2xl overflow-hidden flex flex-col text-slate-200">
      {/* Header - Clickable */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-black/20 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-black/35 select-none transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
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
          <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            PDF REPORT
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
                    ? "bg-indigo-500/10 text-indigo-350 border border-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >
                Semua Bab
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
                      ? "bg-indigo-500/10 text-indigo-350 border border-indigo-500/20"
                      : "text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {ch.title.split(":")[0]}
                </button>
              ))}
            </div>

            {/* Chapter Content area */}
            <div className="p-4 overflow-y-auto max-h-[500px] bg-black/10 space-y-6">
              {activeTab === "all" ? (
                <div className="space-y-6 divide-y divide-white/5">
                  {chapters.map((ch, idx) => (
                    <div key={ch.id} className={idx > 0 ? "pt-6" : ""}>
                      <div className="flex items-center gap-2 mb-3">
                        {ch.icon}
                        <h3 className="font-bold text-white text-sm">
                          {ch.title}
                        </h3>
                      </div>
                      <div className="pl-7">{ch.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {chapters
                    .filter((ch) => ch.id === activeTab)
                    .map((ch) => (
                      <div key={ch.id}>
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                          {ch.icon}
                          <h3 className="font-bold text-white text-base">
                            {ch.title}
                          </h3>
                        </div>
                        <div className="pl-1">{ch.content}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Footer metadata */}
            <div className="p-3 bg-black/20 border-t border-white/5 text-center text-[11px] text-slate-500 flex items-center justify-between">
              <span>Matakuliah: Computer Vision (IF141)</span>
              <span className="font-semibold text-slate-400">
                Kelompok 5 • 2026
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
