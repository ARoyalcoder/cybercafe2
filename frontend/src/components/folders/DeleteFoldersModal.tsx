import { Trash2 } from "lucide-react";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="w-16 h-16 rounded-3xl bg-red-100 flex items-center justify-center mb-5">
            <Trash2
              size={30}
              className="text-red-600"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Delete Folders
          </h2>

          <p className="text-gray-500 mt-3">
            You're about to permanently delete{" "}
            <span className="font-semibold text-gray-900">
              {count} folder
              {count > 1 ? "s" : ""}
            </span>
            .
          </p>

          <p className="text-gray-500 mt-2">
            This action cannot be undone.
          </p>

          <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-4">
            <ul className="text-sm text-red-700 space-y-2">
              <li>
                • Uploaded files will be removed
              </li>

              <li>
                • Folder data will be deleted
              </li>

              <li>
                • Public links will stop working
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t bg-gray-50 p-6 flex gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className="
              flex-1
              py-3
              rounded-xl
              border
              border-gray-300
              font-medium
              hover:bg-white
              transition
            "
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="
              flex-1
              py-3
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              font-medium
              transition
              disabled:opacity-60
            "
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}