import { motion } from "framer-motion";

import {
  CreditCard,
  CheckCircle,
  Calendar,
} from "lucide-react";

interface Props {
  payment: any;
}

export default function PaymentCard({
  payment,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        rounded-3xl
        border
        border-white/10
         bg-white/5
        backdrop-blur-xl
        p-6
        hover:bg-white/10
        transition-all
      "
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left */}

        <div className="flex items-start gap-4">
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-linear-to-br
              from-blue-500/20
              to-cyan-500/20
              flex
              items-center
              justify-center
            "
          >
            <CreditCard
              size={26}
              className="text-cyan-400"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white">
                ₹{payment.amount}
              </h2>

              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                  uppercase
                  bg-violet-500/15
                  text-violet-300
                  border
                  border-violet-500/20
                "
              >
                {payment.plan}
              </span>
            </div>

            <p className="text-slate-400 text-sm mt-3 break-all">
              Payment ID: {payment.paymentId}
            </p>

            <p className="text-slate-500 text-sm break-all">
              Order ID: {payment.orderId}
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex flex-col items-start lg:items-end">
          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              px-4
              py-2
              bg-green-500/15
              border
              border-green-500/20
              text-green-400
            "
          >
            <CheckCircle size={16} />

            <span className="font-medium capitalize">
              {payment.status}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-slate-400">
            <Calendar size={16} />

            <span className="text-sm">
              {new Date(
                payment.paidAt
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}