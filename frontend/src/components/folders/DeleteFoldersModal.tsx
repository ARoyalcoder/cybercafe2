import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

type Props = {
  open: boolean;
  count: number;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteFoldersModal({
  open,
  count,
  loading,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-md
            p-4
          "
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-4xl
              border
              border-white/10
              bg-[#0f172a]
              backdrop-blur-2xl
              shadow-[0_0_60px_rgba(239,68,68,0.15)]
            "
          >
            {/* Header */}

            <div className="relative p-8">
              <button
                onClick={onClose}
                disabled={loading}
                className="
                  absolute
                  right-5
                  top-5
                  rounded-xl
                  p-2
                  text-slate-400
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={18} />
              </button>

              <div
                className="
                  w-16
                  h-16
                  rounded-3xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <Trash2
                  size={30}
                  className="text-red-400"
                />
              </div>

              <h2 className="text-3xl font-bold text-white">
                Delete Folders
              </h2>

              <p className="text-slate-400 mt-3">
                You're about to permanently
                delete{" "}
                <span className="font-semibold text-white">
                  {count} folder
                  {count > 1
                    ? "s"
                    : ""}
                </span>
                .
              </p>

              <p className="text-slate-500 mt-2">
                This action cannot be
                undone.
              </p>

              {/* Warning Box */}

              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  p-4
                "
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle
                    size={16}
                    className="text-red-400"
                  />

                  <span className="text-sm font-medium text-red-400">
                    Warning
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-slate-300">
                  <li>
                    • Uploaded files will
                    be removed
                  </li>

                  <li>
                    • Folder records will
                    be deleted
                  </li>

                  <li>
                    • Public upload links
                    will stop working
                  </li>

                  <li>
                    • This action cannot be
                    reversed
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}

            <div
              className="
                border-t
                border-white/10
                p-6
                flex
                gap-3
              "
            >
              <button
                disabled={loading}
                onClick={onClose}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  py-3
                  font-medium
                  text-slate-300
                  transition
                  hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={onConfirm}
                className="
                  flex-1
                  rounded-xl
                  bg-red-600
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />

                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}