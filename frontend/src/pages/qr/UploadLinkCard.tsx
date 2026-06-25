import { motion } from "framer-motion";
import { toast } from "sonner";

import {
  FaWhatsapp,
  FaShareAlt,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { useState } from "react";

import {
  Link as LinkIcon,
} from "lucide-react";

interface Props {
  publicLink: string;
  onCopy: () => void;
  onShare: () => void;
  onWhatsapp: () => void;
}

export default function UploadLinkCard({
  publicLink,
  onShare,
  onWhatsapp,
}: Props) {

  const [copied, setCopied] =
    useState(false);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);

      setCopied(true);

      toast.success("Link copied successfully!" );

      setTimeout(() => {
        setCopied(false);
      }, 5000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };
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
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <LinkIcon className="text-green-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Upload Link
          </h2>

          <p className="text-slate-400">
            Share anywhere
          </p>
        </div>
      </div>

      <div className="bg-[#020617] rounded-2xl border border-white/10 p-4">
        <p className="text-sm text-slate-500 mb-2">
          Public URL
        </p>

        <p className="break-all text-white">
          {publicLink}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          onClick={handleCopy}
          className="
    bg-blue-600
    hover:bg-blue-700
    text-white
    py-3
    rounded-2xl
    flex
    items-center
    justify-center
    gap-2
    transition-all
    duration-300
  "
        >
          {copied ? (
            <>
              <FaCheck />
              Copied
            </>
          ) : (
            <>
              <FaCopy />
              Copy
            </>
          )}
        </button>

        <button
          onClick={onShare}
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
          <FaShareAlt />
          Share
        </button>
      </div>

      <button
        onClick={onWhatsapp}
        className="
          w-full
          mt-3
          bg-green-600
          hover:bg-green-700
          text-white
          py-3
          rounded-2xl
          flex
          items-center
          justify-center
          gap-2
        "
      >
        <FaWhatsapp />
        WhatsApp
      </button>

      <div className="mt-8 bg-linear-to-r from-violet-600 to-blue-600 rounded-3xl p-6 text-white">
        <h3 className="font-bold text-xl mb-4">
          How It Works
        </h3>

        <div className="space-y-3 text-slate-100">
          <p>1. Share QR or link.</p>
          <p>2. Customer uploads files.</p>
          <p>3. Files arrive in dashboard.</p>
          <p>4. Download and manage instantly.</p>
        </div>
      </div>
    </motion.div>
  );
}