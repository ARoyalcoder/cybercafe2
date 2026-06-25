import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader/Loader";

import { getProfile } from "../../api/authApi";

import QrCard from "./QrCard";
import UploadLinkCard from "./UploadLinkCard";
import InfoCards from "./InfoCards";

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
      } catch {}
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
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#030712] p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="
              relative
              overflow-hidden
              rounded-3xl
              bg-linear-to-r
              from-violet-600
              via-blue-600
              to-cyan-500
              p-8
              text-white
              mb-8
            "
          >
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold">
                Smart Upload Portal
              </h1>

              <p className="mt-4 max-w-2xl text-slate-100">
                Share QR codes,
                collect documents,
                and manage customer
                uploads effortlessly.
              </p>
            </div>

            <div
              className="
                absolute
                top-0
                right-0
                h-64
                w-64
                rounded-full
                bg-white/10
                blur-3xl
              "
            />
          </motion.div>

          {/* Main Content */}

          <div className="grid lg:grid-cols-2 gap-8">
            <QrCard
              qrCode={user.qrCode}
              onDownload={
                downloadQR
              }
              onCopyQR={
                copyQRImage
              }
              onGenerateQR={
                generateNewQR
              }
            />

            <UploadLinkCard
              publicLink={
                user.publicLink
              }
              onCopy={
                copyLink
              }
              onShare={
                shareLink
              }
              onWhatsapp={
                shareWhatsApp
              }
            />
          </div>

          {/* Bottom Info */}

          <InfoCards />
        </div>
      </div>
    </DashboardLayout>
  );
}