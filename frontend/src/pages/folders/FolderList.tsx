import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";
import DashboardLayout from "../../layouts/DashboardLayout";

import SearchBar from "../../components/folders/SearchBar";
import FolderCard from "../../components/folders/FolderCard";
import DeleteFoldersModal from "../../components/folders/DeleteFoldersModal";

import FolderHeader from "./FolderHeader";
import FolderBulkActions from "./FolderBulkActions";

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
          "Folders deleted successfully"
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


  return (<DashboardLayout> <div className="max-w-7xl mx-auto">
    <FolderHeader
      allSelected={
        allSelected
      }
      hasFolders={
        filteredFolders.length >
        0
      }
      onToggleSelectAll={
        toggleSelectAll
      }
    />


    <SearchBar
      value={search}
      onChange={setSearch}
    />

    <FolderBulkActions
      count={
        selectedFolders.length
      }
      onDelete={() =>
        setShowDeleteModal(
          true
        )
      }
    />

    <div className="grid sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-6 mt-8">
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
          No folders found
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
