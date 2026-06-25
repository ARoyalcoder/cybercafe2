import { motion } from "framer-motion";

import {
  IndianRupee,
  Receipt,
  Crown,
} from "lucide-react";

interface Props {
  totalSpent: number;
  totalTransactions: number;
  currentPlan: string;
}

export default function PaymentStats({
  totalSpent,
  totalTransactions,
  currentPlan,
}: Props) {
  const stats = [
    {
      title: "Total Spent",
      value: `₹${totalSpent}`,
      icon: IndianRupee,
      color:
        "from-green-500/20 to-emerald-500/20",
      iconColor:
        "text-green-400",
    },
    {
      title: "Transactions",
      value: totalTransactions,
      icon: Receipt,
      color:
        "from-blue-500/20 to-cyan-500/20",
      iconColor:
        "text-cyan-400",
    },
    {
      title: "Current Plan",
      value: currentPlan,
      icon: Crown,
      color:
        "from-yellow-500/20 to-orange-500/20",
      iconColor:
        "text-yellow-400",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {stats.map(
        (item) => {
          const Icon =
            item.icon;

          return (
            <motion.div
              key={
                item.title
              }
              whileHover={{
                y: -4,
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
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold text-white mt-2 capitalize">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-br
                    ${item.color}
                    flex
                    items-center
                    justify-center
                  `}
                >
                  <Icon
                    size={26}
                    className={
                      item.iconColor
                    }
                  />
                </div>
              </div>
            </motion.div>
          );
        }
      )}
    </div>
  );
}