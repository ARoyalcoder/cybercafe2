interface Props {
allSelected: boolean;
hasFolders: boolean;
onToggleSelectAll: () => void;
}

export default function FolderHeader({
allSelected,
hasFolders,
onToggleSelectAll,
}: Props) {
return (
    
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"> <div> <h1 className="text-3xl font-bold text-white">
Folders </h1>

    <p className="text-slate-400 mt-1">
      Manage and organize your customer folders.
    </p>
  </div>

  {hasFolders && (
    <button
      onClick={
        onToggleSelectAll
      }
      className="text-sm font-semibold text-violet-400"
    >
      {allSelected
        ? "Deselect All"
        : "Select All"}
    </button>
  )}
</div>


);
}
