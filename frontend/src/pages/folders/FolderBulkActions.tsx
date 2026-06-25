import {
Trash2,
CheckCircle2,
} from "lucide-react";

interface Props {
count: number;
onDelete: () => void;
}

export default function FolderBulkActions({
count,
onDelete,
}: Props) {
if (!count) return null;

return ( <div className="sticky top-4 z-20 mt-6"> <div
     className="
       bg-white/5
       border
       border-white/10
       backdrop-blur-xl
       rounded-2xl
       px-5
       py-4
       flex
       items-center
       justify-between
     "
   > <div className="flex items-center gap-3"> <div
         className="
           w-10
           h-10
           rounded-xl
           bg-violet-500/10
           flex
           items-center
           justify-center
         "
       > <CheckCircle2
           size={20}
           className="text-violet-400"
         /> </div>


      <div>
        <p className="font-semibold text-white">
          {count} Selected
        </p>

        <p className="text-sm text-slate-400">
          Ready for bulk actions
        </p>
      </div>
    </div>

    <button
      onClick={onDelete}
      className="
        flex
        items-center
        gap-2
        bg-red-600
        hover:bg-red-700
        text-white
        px-5
        py-3
        rounded-xl
        font-medium
      "
    >
      <Trash2 size={18} />
      Delete Selected
    </button>
  </div>
</div>


);
}
