// it will be responsive on both desktop and mobile

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { CommandList } from "cmdk";

interface Props {
  // array of object
  options: Array<{
    id: string;
    value: string;
    children: React.ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (query: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
  isSearchable?: boolean;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (open: boolean) => {
    onSearch?.("");  //to reset the search when the dialog opens
    setOpen(open);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant="outline"
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>

      <CommandResponsiveDialog
       open={open} onOpenChange={handleOpenChange} shouldFilter={!onSearch}> {/*it will not do internal filtering , it will do according to our */}
        <CommandInput placeholder="Search..." onValueChange={onSearch} />

        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No results found.
            </span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
