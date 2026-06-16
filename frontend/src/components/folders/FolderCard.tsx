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
            "bg-yellow-100 text-yellow-700",

        completed:
            "bg-blue-100 text-blue-700",

        approved:
            "bg-green-100 text-green-700",

        rejected:
            "bg-red-100 text-red-700",
    };


    // return (
    //     <Link to={`/folders/${folder._id}`} >
    //         <motion.div
    //             onClick={() =>
    //                 navigate(
    //                     `/folders/${folder._id}`
    //                 )
    //             }
    //             whileHover={{
    //                 y: -4,
    //             }}
    //             className="bg-white p-5 rounded-xl shadow cursor-pointer"
    //         >
    //             <div className="flex justify-between">
    //                 <input
    //                     type="checkbox"
    //                     checked={selected}
    //                     onChange={() =>
    //                         onSelect(folder._id)
    //                     }
    //                     onClick={(e) =>
    //                         e.stopPropagation()
    //                     }
    //                 />

    //                 <h2 className="font-bold">
    //                     {folder.folderName}
    //                 </h2>
    //             </div>
    //             <span
    //                 className={`px-3 py-1 rounded-full text-sm ${statusColor[
    //                     folder.status as keyof typeof statusColor
    //                 ]
    //                     }`}
    //             >
    //                 {folder.status}
    //             </span>
    //             <p className="text-sm text-gray-500">
    //                 Customer:{" "}
    //                 {folder.customerName}
    //             </p>

    //             <p className="text-sm text-gray-500">
    //                 Files:{" "}
    //                 {folder.totalFiles}
    //             </p>
    //         </motion.div>
    //     </Link>
    // );
    return (
        <motion.div
            whileHover={{
                y: -4,
            }}
            transition={{
                duration: 0.2,
            }}
        >
            <Link
                to={`/folders/${folder._id}`}
                className="block"
            >
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <FolderOpen
                                    size={24}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                    {folder.folderName}
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Folder ID: {folder._id.slice(-6)}
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
                            className="h-4 w-4 accent-blue-600"
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor[
                                folder.status as keyof typeof statusColor
                                ]
                                }`}
                        >
                            {folder.status}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <User size={16} />
                                <span>Customer</span>
                            </div>

                            <span className="font-medium text-gray-800">
                                {folder.customerName}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Files size={16} />
                                <span>Files</span>
                            </div>

                            <span className="font-medium text-gray-800">
                                {folder.totalFiles}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-blue-600 font-medium">
                            View Folder
                        </span>

                        <ChevronRight
                            size={18}
                            className="text-gray-400 group-hover:translate-x-1 transition-transform"
                        />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}