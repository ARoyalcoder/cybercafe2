import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

import {
  QrCode,
  ShieldCheck,

} from "lucide-react";

interface Props {
  qrCode: string;
  onDownload: () => void;
  onCopyQR: () => void;
  onGenerateQR: () => void;
}

export default function QrCard({
  qrCode,
  onDownload,

}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-8
      "
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
          <QrCode className="text-violet-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            QR Code
          </h2>

          <p className="text-slate-400">
            Scan & Upload
          </p>
        </div>
      </div>

      <div className="bg-[#020617] rounded-3xl p-8 border border-white/10 relative">
        <img
          src={qrCode}
          alt="QR"
          className="w-full max-w-xs mx-auto"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-xl p-2 shadow-xl">
            <ShieldCheck
              size={28}
              className="text-violet-600"
            />
          </div>
        </div>
      </div>

      <div className="grid  gap-3   w-auto mt-6">
        <button
          onClick={onDownload}
          className="
            bg-violet-600
            hover:bg-violet-700
            text-white
            py-3
           
            rounded-2xl
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <FaDownload />
          Download
        </button>


      </div>


    </motion.div>
  );
}