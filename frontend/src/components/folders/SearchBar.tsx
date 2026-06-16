import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (
    value: string
  ) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search folders, customers..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          h-12
          pl-11
          pr-4
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          text-sm
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/20
          focus:border-blue-500
          transition-all
          duration-200
        "
      />
    </div>
  );
}