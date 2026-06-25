import { Link } from "react-router-dom";

import {
  FolderOpen,
  ChevronRight,
  Clock3,
} from "lucide-react";

interface Props {
  recentFolders: any[];
}

export default function RecentUploads({
  recentFolders,
}: Props) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Uploads
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Latest customer uploads
          </p>
        </div>

        <Link
          to="/folders"
          className="
            text-cyan-400
            font-medium
            hover:text-cyan-300
            transition
          "
        >
          View All
        </Link>
      </div>

      {recentFolders.length === 0 ? (
        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-12
            text-center
          "
        >
          <FolderOpen
            size={50}
            className="mx-auto text-slate-500"
          />

          <h3 className="mt-4 text-lg font-semibold text-white">
            No Uploads Yet
          </h3>

          <p className="text-slate-400 mt-2">
            Recent uploads will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {recentFolders
            .slice(0, 5)
            .map((folder: any) => (
              <Link
                key={folder._id}
                to={`/folders/${folder._id}`}
                className="
                  group
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  p-5
                  hover:bg-white/10
                  hover:border-violet-500/20
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                {/* Top */}

                <div className="flex items-center justify-between">
                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-linear-to-br
                      from-violet-500/20
                      to-cyan-500/20
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FolderOpen
                      size={28}
                      className="text-cyan-400"
                    />
                  </div>

                  <ChevronRight
                    size={18}
                    className="
                      text-slate-500
                      group-hover:text-cyan-400
                      group-hover:translate-x-1
                      transition-all
                    "
                  />
                </div>

                {/* Content */}

                <div className="mt-5">
                  <h3 className="font-semibold text-white truncate">
                    {folder.customerName}
                  </h3>

                  <p className="text-sm text-slate-400 truncate mt-1">
                    {folder.folderName}
                  </p>
                </div>

                {/* Files */}

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Files
                    </p>

                    <p className="font-bold text-lg text-white">
                      {folder.totalFiles}
                    </p>
                  </div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      bg-green-500/15
                      text-green-400
                      border
                      border-green-500/20
                    "
                  >
                    Active
                  </span>
                </div>

                {/* Date */}

                <div
                  className="
                    mt-4
                    pt-4
                    border-t
                    border-white/10
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-slate-500
                  "
                >
                  <Clock3 size={13} />

                  {new Date(
                    folder.createdAt
                  ).toLocaleDateString()}
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}