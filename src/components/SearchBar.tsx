import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  defaultValue?: string;
};

export default function SearchBar({ placeholder = "Search", defaultValue = "" }: SearchBarProps) {
  return (
    <form action="/search" className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <Search className="h-4 w-4" aria-hidden="true" />
      </span>
      <input
        name="query"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-full border border-neutral-200 bg-neutral-25 py-2.5 pl-10 pr-4 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
      />
    </form>
  );
}

