import { motion } from "framer-motion";
import {
  CheckCircle,
  Upload,
} from "lucide-react";

interface Props {
  totalFiles: number;
}

export default function UploadSuccess({
  totalFiles,
}: Props) {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        className="
          w-full
          max-w-lg
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          p-10
          text-center
        "
      >
        <div
          className="
            mx-auto
            mb-6
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-green-500/10
          "
        >
          <CheckCircle
            size={50}
            className="text-green-400"
          />
        </div>

        <h1 className="text-3xl font-bold text-white">
          Upload Successful 🎉
        </h1>

        <p className="mt-4 text-slate-400">
          Your documents have been uploaded
          successfully and are now available
          for review.
        </p>

        <div
          className="
            mt-8
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-5
          "
        >
          <div className="flex items-center justify-center gap-3">
            <Upload
              size={22}
              className="text-cyan-400"
            />

            <span className="text-white font-semibold">
              {totalFiles} File
              {totalFiles > 1 ? "s" : ""}
              Uploaded
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          You may safely close this page.
        </p>
      </motion.div>
    </div>
  );
}