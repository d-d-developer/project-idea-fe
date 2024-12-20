"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (valueToRemove: string) => {
    onChange(selected.filter((value) => value !== valueToRemove));
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex min-h-[36px] w-full flex-wrap gap-1.5 rounded-md border border-input bg-transparent px-3 py-1 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => setIsOpen(true)}
      >
        {selected.map((value) => {
          const option = options.find((opt) => opt.value === value);
          return option ? (
            <Badge
              key={value}
              variant="secondary"
              className="hover:bg-secondary/80"
            >
              {option.label}
              <button
                className="ml-1 rounded-full outline-none hover:bg-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(value);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null;
        })}
        <input
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[60px]"
          placeholder={selected.length === 0 ? placeholder : "Add more..."}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClick={() => setIsOpen(true)}
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
          <ScrollArea className="h-[200px] p-1">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                  selected.includes(option.value) ? "bg-secondary/50" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No options found
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
