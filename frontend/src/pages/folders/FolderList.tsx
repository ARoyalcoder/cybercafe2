import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Trash2,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";

import SearchBar from "../../components/folders/SearchBar";

import FolderCard from "../../components/folders/FolderCard";

import DeleteFoldersModal from "../../components/folders/DeleteFoldersModal";

import {
  getFolders,
  bulkDeleteFolders,
} from "../../api/folderApi";

export default function FolderList() {
  const [folders, setFolders] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedFolders,
    setSelectedFolders,
  ] = useState<string[]>([]);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  useEffect(() => {
    getFolders()
      .then((res) =>
        setFolders(res.folders)
      )
      .catch(() =>
        toast.error(
          "Failed to load folders"
        )
      );
  }, []);

  const filteredFolders =
    useMemo(
      () =>
        folders.filter(
          (folder) =>
            folder.folderName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        ),
      [folders, search]
    );

  const handleSelectFolder = (
    id: string
  ) => {
    setSelectedFolders((prev) =>
      prev.includes(id)
        ? prev.filter(
            (folderId) =>
              folderId !== id
          )
        : [...prev, id]
    );
  };

  const allSelected =
    filteredFolders.length > 0 &&
    filteredFolders.every(
      (folder) =>
        selectedFolders.includes(
          folder._id
        )
    );

  const toggleSelectAll =
    () => {
      setSelectedFolders(
        allSelected
          ? []
          : filteredFolders.map(
              (folder) =>
                folder._id
            )
      );
    };

  const handleBulkDelete =
    async () => {
      if (
        !selectedFolders.length
      )
        return;

      const backup =
        folders;

      setIsDeleting(true);

      setFolders((prev) =>
        prev.filter(
          (folder) =>
            !selectedFolders.includes(
              folder._id
            )
        )
      );

      try {
        await bulkDeleteFolders(
          selectedFolders
        );

        toast.success(
          `${selectedFolders.length} folder${
            selectedFolders.length >
            1
              ? "s"
              : ""
          } deleted successfully`
        );

        setSelectedFolders(
          []
        );

        setShowDeleteModal(
          false
        );
      } catch {
        setFolders(
          backup
        );

        toast.error(
          "Delete failed"
        );
      } finally {
        setIsDeleting(
          false
        );
      }
    };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Folders
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and organize your customer folders.
            </p>
          </div>

          {filteredFolders.length >
            0 && (
            <button
              onClick={
                toggleSelectAll
              }
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {allSelected
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
        </div>

        {/* Search */}

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        {/* Bulk Action Bar */}

        {selectedFolders.length >
          0 && (
          <div className="sticky top-4 z-20 mt-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CheckCircle2
                    size={20}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {
                      selectedFolders.length
                    }{" "}
                    Selected
                  </p>

                  <p className="text-sm text-gray-500">
                    Ready for bulk actions
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setShowDeleteModal(
                    true
                  )
                }
                className="
                  flex items-center gap-2
                  bg-red-600 hover:bg-red-700
                  text-white
                  px-5 py-3
                  rounded-xl
                  font-medium
                "
              >
                <Trash2
                  size={18}
                />

                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Folder Grid */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredFolders.length >
          0 ? (
            filteredFolders.map(
              (folder) => (
                <FolderCard
                  key={
                    folder._id
                  }
                  folder={
                    folder
                  }
                  selected={selectedFolders.includes(
                    folder._id
                  )}
                  onSelect={
                    handleSelectFolder
                  }
                />
              )
            )
          ) : (
            <div className="col-span-full">
              <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-16 text-center">
                <h3 className="text-xl font-semibold text-gray-700">
                  No folders found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try another search term.
                </p>
              </div>
            </div>
          )}
        </div>

        <DeleteFoldersModal
          open={
            showDeleteModal
          }
          count={
            selectedFolders.length
          }
          loading={
            isDeleting
          }
          onClose={() =>
            setShowDeleteModal(
              false
            )
          }
          onConfirm={
            handleBulkDelete
          }
        />
      </div>
    </DashboardLayout>
  );
}