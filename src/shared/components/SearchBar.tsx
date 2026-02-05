 "use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  defaultValue?: string;
};

export default function SearchBar({ placeholder = "Search", defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) {
      router.push("/search");
      return;
    }
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <button
        type="submit"
        aria-label="Search"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      >
        <Search className="search-icon" aria-hidden="true" />
      </button>
      <input
        name="query"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="search-control search-input w-full border-neutral-200 bg-neutral-25 text-neutral-900 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-500"
      />
    </form>
  );
}

