import { motion } from "framer-motion";
import {
  ShieldCheck,
  CloudUpload,
  QrCode,
} from "lucide-react";
import {
  Navigate,
} from "react-router-dom";

export default function Login() {
  const token =
    localStorage.getItem(
      "token"
    );

  if (token) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Blobs */}

      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />

      {/* Login Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          w-full
          max-w-md
          bg-white/80
          backdrop-blur-xl
          border
          border-white/30
          shadow-2xl
          rounded-4xl
          p-8
          relative
          z-10
        "
      >
        {/* Logo */}

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
            D
          </div>
        </div>

        {/* Header */}

        <h1 className="text-4xl font-bold text-center text-gray-900">
          DocFlow
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Secure Document Collection Platform
        </p>

        {/* Features */}

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CloudUpload
                size={18}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="font-medium">
                Easy File Collection
              </p>

              <p className="text-sm text-gray-500">
                Receive documents from customers instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <QrCode
                size={18}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="font-medium">
                QR Based Uploads
              </p>

              <p className="text-sm text-gray-500">
                Share upload links and QR codes easily.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <ShieldCheck
                size={18}
                className="text-purple-600"
              />
            </div>

            <div>
              <p className="font-medium">
                Secure Storage
              </p>

              <p className="text-sm text-gray-500">
                Protected document management system.
              </p>
            </div>
          </div>
        </div>

        {/* Google Login */}

        <button
          onClick={handleGoogleLogin}
          className="
            mt-8
            w-full
            bg-white
            border
            border-gray-200
            hover:border-gray-300
            hover:shadow-md
            transition-all
            py-3.5
            rounded-2xl
            flex
            items-center
            justify-center
            gap-3
            font-medium
            text-gray-700
          "
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />

          Continue with Google
        </button>

        {/* Footer */}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            By continuing, you agree to our Terms &
            Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}