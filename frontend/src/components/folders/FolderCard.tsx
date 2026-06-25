import { motion } from "framer-motion";
import { Link } from "react-router-dom";
type Props = {
    folder: any;
    selected: boolean;
    onSelect: (
        id: string
    ) => void;
};

import {
    FolderOpen,
    User,
    Files,
    ChevronRight,
} from "lucide-react";
export default function FolderCard({
    folder,
    selected,
    onSelect,
}: Props) {


    const statusColor = {
        pending:
            "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

        completed:
            "bg-blue-500/10 text-blue-400 border border-blue-500/20",

        approved:
            "bg-green-500/10 text-green-400 border border-green-500/20",

        rejected:
            "bg-red-500/10 text-red-400 border border-red-500/20",
    };


    return (
        <motion.div
            whileHover={{
                y: -6,
            }}
            transition={{
                duration: 0.2,
            }}

        >


            <Link

                to={`/folders/${folder._id}`}
                className="block"
            >
                <div
                    className={`
      group
      rounded-3xl
      border
      backdrop-blur-xl
      transition-all
      duration-300
      overflow-hidden

      ${selected
                            ? "bg-violet-500/10 border-violet-500/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet-500/20"
                        }
    `}
                >
                    {/* Top Glow */}

                    <div
                        className="
        h-1
        bg-linear-to-r
        from-violet-500
        via-blue-500
        to-cyan-500
      "
                    />

                    <div className="p-5">
                        {/* Header */}

                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="
              w-14
              h-14
              rounded-2xl
              bg-violet-500/10
              flex
              items-center
              justify-center
            "
                                >
                                    <FolderOpen
                                        size={28}
                                        className="text-violet-400"
                                    />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-white text-lg line-clamp-1">
                                        {folder.folderName}
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        #{folder._id.slice(-6)}
                                    </p>
                                </div>
                            </div>

                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={() =>
                                    onSelect(folder._id)
                                }
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                                className="
            h-4
            w-4
            accent-violet-500
          "
                            />
                        </div>

                        {/* Status */}

                        <div className="mt-5">
                            <span
                                className={`
            inline-flex
            items-center
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${statusColor[
                                    folder.status as keyof typeof statusColor
                                    ]
                                    }
          `}
                            >
                                {folder.status}
                            </span>
                        </div>

                        {/* Details */}

                        <div className="mt-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <User size={16} />
                                    <span className="text-sm">
                                        Customer
                                    </span>
                                </div>

                                <span className="text-sm font-medium text-white">
                                    {folder.customerName}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Files size={16} />
                                    <span className="text-sm">
                                        Files
                                    </span>
                                </div>

                                <span className="text-sm font-medium text-white">
                                    {folder.totalFiles}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}

                        <div
                            className="
          mt-5
          pt-4
          border-t
          border-white/10
          flex
          items-center
          justify-between
        "
                        >
                            <span className="text-sm font-medium text-violet-400">
                                Open Folder
                            </span>

                            <ChevronRight
                                size={18}
                                className="
            text-slate-500
            transition-transform
            group-hover:translate-x-1
          "
                            />
                        </div>
                    </div>
                </div>
            </Link>


        </motion.div >
    );

}