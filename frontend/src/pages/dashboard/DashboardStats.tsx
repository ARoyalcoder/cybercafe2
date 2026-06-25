import { Link } from "react-router-dom";

import {
    FolderOpen,
    FileText,
    HardDrive,
    Crown,
    CreditCard,
    QrCode,
} from "lucide-react";

interface Props {
    stats: any;
}

export default function DashboardStats({
    stats,
}: Props) {
    const storageUsedMB =
        (
            (stats?.storageUsed || 0) /
            1024 /
            1024
        ).toFixed(2);

    return (
        <>
            {/* Stats */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Folder Card */}

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/10 transition">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                Total Folders
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {stats?.totalFolders ??
                                    0}
                            </h2>
                        </div>

                        <FolderOpen
                            size={40}
                            className="text-blue-500"
                        />
                    </div>
                </div>

                {/* Files */}

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/10 transition">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                Total Files
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {stats?.totalFiles ??
                                    0}
                            </h2>
                        </div>

                        <FileText
                            size={40}
                            className="text-green-500"
                        />
                    </div>
                </div>

                {/* Storage */}

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/10 transition">                    <div className="flex justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">
                            Storage Used
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {storageUsedMB}
                            MB
                        </h2>
                    </div>

                    <HardDrive
                        size={40}
                        className="text-purple-500"
                    />
                </div>
                </div>

                {/* Plan */}

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/10 transition">                    <div className="flex justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">
                            Current Plan
                        </p>

                        <h2 className="text-3xl font-bold mt-2 capitalize">
                            {stats?.plan ||
                                "free"}
                        </h2>
                    </div>

                    <Crown
                        size={40}
                        className="text-yellow-500"
                    />
                </div>
                </div>
            </div>

            {/* Quick Actions */}

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        to="/payments"
                        className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/10 transition"
                    >
                        <CreditCard
                            size={36}
                            className="text-blue-500 mb-4"
                        />

                        <h3 className="font-semibold text-lg">
                            Payment History
                        </h3>

                        <p className="text-gray-500 text-sm">
                            View all payment
                            transactions.
                        </p>
                    </Link>

                    <Link
                        to="/qr"
                        className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/10 transition"
                    >
                        <QrCode
                            size={36}
                            className="text-green-500 mb-4"
                        />

                        <h3 className="font-semibold text-lg">
                            QR Upload
                        </h3>

                        <p className="text-gray-500 text-sm">
                            Share upload QR and
                            link.
                        </p>
                    </Link>

                    <Link
                        to="/folders"
                        className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/10 transition"
                    >
                        <FolderOpen
                            size={36}
                            className="text-orange-500 mb-4"
                        />

                        <h3 className="font-semibold text-lg">
                            Manage Folders
                        </h3>

                        <p className="text-gray-500 text-sm">
                            View uploaded
                            documents.
                        </p>
                    </Link>
                </div>
            </div>
        </>
    );
}