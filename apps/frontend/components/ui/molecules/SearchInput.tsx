"use client";

import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { ChangeEvent, InputHTMLAttributes, useRef } from "react";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
  onClear: () => void;
  clearLabel: string;
}

export function SearchInput({
  value,
  onValueChange,
  onClear,
  clearLabel,
  placeholder,
  className,
  ...props
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value);
  };

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <div className={cn("flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-11", className)}>
      <Search className="h-4 w-4 text-slate-300" />
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
        {...props}
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label={clearLabel}
          className="rounded-full p-1 text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-bg"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
