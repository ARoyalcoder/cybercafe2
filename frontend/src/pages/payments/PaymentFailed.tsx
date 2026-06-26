import { motion } from "framer-motion";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-rose-100 flex items-center justify-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          max-w-md
          w-full
        bg-white/5
          rounded-4xl
          shadow-2xl
          border
          border-red-100
          p-8
          text-center
        "
      >
        {/* Icon */}

        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle
              size={60}
              className="text-red-600"
            />
          </div>
        </div>

        {/* Content */}

        <h1 className="text-3xl font-bold text-gray-900 mt-6">
          Payment Failed
        </h1>

        <p className="text-gray-500 mt-3">
          We couldn't process your payment.
          Please verify your payment details
          and try again.
        </p>

        {/* Error Card */}

        <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-sm text-red-700">
            Your transaction was not completed.
            No amount has been deducted from
            your account.
          </p>
        </div>

        {/* Actions */}

        <div className="mt-8 space-y-3">
          <Link
            to="/subscription"
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-red-600
              hover:bg-red-700
              text-white
              py-3
              rounded-2xl
              font-semibold
              transition
            "
          >
            <RefreshCw size={18} />
            Try Again
          </Link>

          <Link
            to="/dashboard"
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              border
              border-gray-200
              hover:bg-gray-50
              py-3
              rounded-2xl
              font-semibold
              text-gray-700
              transition
            "
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Footer */}

        <p className="text-xs text-gray-400 mt-6">
          If the issue persists, contact support.
        </p>
      </motion.div>
    </div>
  );
}