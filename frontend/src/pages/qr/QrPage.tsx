import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getProfile } from "../../api/authApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  FaWhatsapp,
  FaShareAlt,
  FaCopy,
  FaDownload,
} from "react-icons/fa";

import {
  QrCode,
  Link as LinkIcon,
  ShieldCheck,
  Upload,
  RefreshCcw,

  Copy,
} from "lucide-react";
import Loader from "../../components/Loader/Loader";

export default function QrPage() {
  const [user, setUser] =
    useState<any>(null);



  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const res =
            await getProfile();

          setUser(res.user);
        } catch {
          toast.error(
            "Failed to load profile"
          );
        }
      };

    fetchProfile();
  }, []);

  const copyLink =
    async () => {
      try {
        await navigator.clipboard.writeText(
          user.publicLink
        );

        toast.success(
          "Link copied successfully"
        );
      } catch {
        toast.error(
          "Failed to copy link"
        );
      }
    };

  const shareWhatsApp =
    () => {
      const message = `📄 Upload your documents using the link below:\n\n${user.publicLink}`;

      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    };

  const shareLink =
    async () => {
      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            {
              title:
                "Document Upload",
              text:
                "Upload your documents using this link",
              url: user.publicLink,
            }
          );

          toast.success(
            "Shared successfully"
          );
        } else {
          copyLink();
        }
      } catch { }
    };

  const downloadQR =
    () => {
      const link =
        document.createElement(
          "a"
        );

      link.href =
        user.qrCode;

      link.download =
        "upload-qr.png";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      toast.success(
        "QR downloaded"
      );
    };

  const copyQRImage =
    async () => {
      try {
        const response =
          await fetch(
            user.qrCode
          );

        const blob =
          await response.blob();

        await navigator.clipboard.write(
          [
            new ClipboardItem(
              {
                [blob.type]:
                  blob,
              }
            ),
          ]
        );

        toast.success(
          "QR copied as image"
        );
      } catch {
        toast.error(
          "Failed to copy QR"
        );
      }
    };

  const generateNewQR =
    () => {
      toast.success(
        "Generate QR API coming soon"
      );
    };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center min-h-screen ">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600 text-white p-8 mb-8 shadow-xl"
          >
            <h1 className="text-4xl font-bold">
              Smart Upload
              Portal
            </h1>

            <p className="mt-3 text-blue-100 max-w-2xl">
              Share QR
              codes,
              collect
              documents,
              and manage
              customer
              uploads
              effortlessly.
            </p>
          </motion.div>

          {/* Stats */}


          {/* Main */}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* QR CARD */}

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <QrCode className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    QR Code
                  </h2>

                  <p className="text-gray-500">
                    Scan &
                    Upload
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-br from-white to-gray-50 rounded-3xl p-8 border relative">
                <img
                  src={
                    user.qrCode
                  }
                  alt="QR"
                  className="w-full max-w-xs mx-auto"
                />

                {/* Watermark */}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white shadow-xl rounded-xl p-2">
                    <ShieldCheck
                      size={
                        28
                      }
                      className="text-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={
                    downloadQR
                  }
                  className="bg-gray-900 hover:bg-black text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                >
                  <FaDownload />
                  Download
                </button>

                <button
                  onClick={
                    copyQRImage
                  }
                  className="bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                >
                  <Copy size={18} />
                  Copy QR
                </button>
              </div>

              <button
                onClick={
                  generateNewQR
                }
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <RefreshCcw size={18} />
                Generate
                New QR
              </button>
            </motion.div>

            {/* LINK CARD */}

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                  <LinkIcon className="text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Upload
                    Link
                  </h2>

                  <p className="text-gray-500">
                    Share
                    anywhere
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl border p-4">
                <p className="text-sm text-gray-500 mb-2">
                  Public URL
                </p>

                <p className="break-all font-medium">
                  {
                    user.publicLink
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={
                    copyLink
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2"
                >
                  <FaCopy />
                  Copy
                </button>

                <button
                  onClick={
                    shareLink
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2"
                >
                  <FaShareAlt />
                  Share
                </button>
              </div>

              <button
                onClick={
                  shareWhatsApp
                }
                className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                <FaWhatsapp />
                WhatsApp
              </button>

              <div className="mt-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white">
                <h3 className="font-bold text-xl mb-4">
                  How It
                  Works
                </h3>

                <div className="space-y-3 text-blue-100">
                  <p>
                    1. Share
                    QR or
                    link.
                  </p>

                  <p>
                    2.
                    Customer
                    uploads
                    files.
                  </p>

                  <p>
                    3. Files
                    arrive in
                    dashboard.
                  </p>

                  <p>
                    4.
                    Download
                    and
                    manage
                    instantly.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Cards */}

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-3xl border p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Upload className="text-blue-600" />
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Upload
                    Method
                  </p>

                  <h3 className="font-semibold text-lg">
                    QR +
                    Direct
                    Link
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                  <ShieldCheck className="text-green-600" />
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Security
                  </p>

                  <h3 className="font-semibold text-lg">
                    Secure
                    Uploads
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}