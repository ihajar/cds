"use client";

import React, { useCallback, useRef, type ChangeEvent } from "react";
import debounce from "debounce";
import { useQueryState } from "nuqs";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

function debounceFunc<T extends (...args: any) => any>(
  func: T,
  wait: number,
  opts: { immediate: boolean }
) {
  return debounce(func, wait, opts);
}

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = (props: SearchInputProps) => {
  const { className, ...rest } = props;

  const [q, setSearch] = useQueryState("q", { shallow: false });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    debounceFunc(
      (value: string) => {
        setSearch(value || null);
      },
      1000,
      { immediate: false }
    ),
    []
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleSearch(newValue);
  };

  const clearSearch = () => {
    setSearch(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <form className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
            ref={inputRef}
            defaultValue={q || ""}
            className={cn(className, "pl-8")}
            onChange={onChange}
            type="text"
            {...rest}
        />
        {q && (
            <XIcon
                className="absolute right-2.5 top-2.5 h-4 w-4 text-white bg-slate-500 p-0.5 rounded-full cursor-pointer"
                onClick={clearSearch}
            />
        )}
    </form>
  )
};
