import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Crown,
  Receipt,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          max-w-lg
          w-full
          bg-white
          rounded-4xl
          shadow-2xl
          border
          border-green-100
          p-8
          text-center
        "
      >
        {/* Success Icon */}

        <div className="flex justify-center">
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              type: "spring",
            }}
            className="
              w-28
              h-28
              rounded-full
              bg-green-100
              flex
              items-center
              justify-center
            "
          >
            <CheckCircle
              size={70}
              className="text-green-600"
            />
          </motion.div>
        </div>

        {/* Heading */}

        <h1 className="text-4xl font-bold text-gray-900 mt-6">
          Payment Successful
        </h1>

        <p className="text-gray-500 mt-3">
          Your payment has been processed successfully
          and your subscription is now active.
        </p>

        {/* Success Card */}

        <div className="mt-8 bg-green-50 border border-green-100 rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <Crown
                size={24}
                className="text-green-600"
              />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-900">
                Subscription Activated
              </h3>

              <p className="text-sm text-gray-500">
                Premium features are now available.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}

        <div className="mt-6 text-left bg-gray-50 rounded-3xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            What's Included
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle
                size={18}
                className="text-green-500"
              />
              <span>
                Increased storage capacity
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle
                size={18}
                className="text-green-500"
              />
              <span>
                Higher upload limits
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle
                size={18}
                className="text-green-500"
              />
              <span>
                Priority support access
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle
                size={18}
                className="text-green-500"
              />
              <span>
                Premium dashboard features
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-8 space-y-3">
          <Link
            to="/dashboard"
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-2xl
              font-semibold
              transition
            "
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/payments"
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
            <Receipt size={18} />
            View Payment History
          </Link>
        </div>

        {/* Footer */}

        <p className="text-xs text-gray-400 mt-6">
          Thank you for choosing our platform.
        </p>
      </motion.div>
    </div>
  );
}