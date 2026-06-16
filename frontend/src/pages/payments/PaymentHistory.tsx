import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

import { motion } from "framer-motion";

import {
  CreditCard,
  CheckCircle,
  IndianRupee,
  Receipt,
  Calendar,
  Crown,
} from "lucide-react";

export default function PaymentHistory() {
  const [payments, setPayments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchPayments =
      async () => {
        try {
          const res =
            await api.get(
              "/payments/history"
            );

          setPayments(
            res.data.payments ||
              []
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchPayments();
  }, []);

  const totalSpent =
    payments.reduce(
      (
        acc,
        payment
      ) =>
        acc +
        payment.amount,
      0
    );

  const totalTransactions =
    payments.length;

  const currentPlan =
    payments.length >
    0
      ? payments[
          0
        ]?.plan?.toUpperCase()
      : "FREE";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Billing &
            Payments
          </h1>

          <p className="text-gray-500 mt-2">
            Manage
            subscriptions
            and track
            payment
            history.
          </p>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={
                    item
                  }
                  className="
                    h-32
                    rounded-3xl
                    bg-gray-100
                    animate-pulse
                  "
                />
              )
            )}
          </div>
        ) : (
          <>
            {/* Summary Cards */}

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{
                  y: -4,
                }}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-gray-200
                  p-6
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                "
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Total
                      Spent
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      ₹
                      {
                        totalSpent
                      }
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                    <IndianRupee className="text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -4,
                }}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-gray-200
                  p-6
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                "
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Transactions
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {
                        totalTransactions
                      }
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Receipt className="text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -4,
                }}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-gray-200
                  p-6
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                "
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Current
                      Plan
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {
                        currentPlan
                      }
                    </h2>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center">
                    <Crown className="text-yellow-500" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Payment History */}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Payment
                History
              </h2>

              <p className="text-gray-500 mt-1">
                All your
                successful
                transactions.
              </p>
            </div>

            {payments.length ===
            0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center">
                <Receipt
                  size={
                    60
                  }
                  className="mx-auto text-gray-300"
                />

                <h3 className="text-xl font-semibold mt-4">
                  No
                  Payments
                  Yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Your
                  billing
                  history
                  will
                  appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {payments.map(
                  (
                    payment: any
                  ) => (
                    <motion.div
                      key={
                        payment._id
                      }
                      whileHover={{
                        y: -3,
                      }}
                      className="
                        bg-white
                        rounded-3xl
                        border
                        border-gray-200
                        p-6
                        shadow-sm
                        hover:shadow-lg
                        transition-all
                      "
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left */}

                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <CreditCard
                              size={
                                26
                              }
                              className="text-blue-600"
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-2xl font-bold text-gray-900">
                                ₹
                                {
                                  payment.amount
                                }
                              </h2>

                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 uppercase">
                                {
                                  payment.plan
                                }
                              </span>
                            </div>

                            <p className="text-gray-500 text-sm mt-3 break-all">
                              Payment
                              ID:
                              {" "}
                              {
                                payment.paymentId
                              }
                            </p>

                            <p className="text-gray-500 text-sm break-all">
                              Order
                              ID:
                              {" "}
                              {
                                payment.orderId
                              }
                            </p>
                          </div>
                        </div>

                        {/* Right */}

                        <div className="flex flex-col items-start lg:items-end">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                            <CheckCircle
                              size={
                                16
                              }
                            />

                            <span className="font-medium capitalize">
                              {
                                payment.status
                              }
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-gray-500">
                            <Calendar
                              size={
                                16
                              }
                            />

                            <span className="text-sm">
                              {new Date(
                                payment.paidAt
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}