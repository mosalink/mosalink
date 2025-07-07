"use client";

import * as React from "react";
import { useState } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "../../../lib/types";

interface CategorySelectProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CategorySelectCombobox = ({
  categories = [],
  selectedCategoryId,
  onCategorySelect,
  placeholder = "Sélectionner une catégorie...",
  className,
  disabled = false,
}: CategorySelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedCategory = categories.find(cat => 
    String(cat.id) === String(selectedCategoryId)
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "inline-flex items-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between bg-slate-100 w-full",
            !selectedCategory && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span>
            {selectedCategory ? selectedCategory.name : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 md:w-[512px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="mt-2 max-h-64 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Catégories
                </div>
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCategorySelect(category.id);
                      setSearchValue("");
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-2 py-2 text-sm rounded-md hover:bg-muted flex items-center",
                      selectedCategoryId === category.id && "bg-muted"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategoryId === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucune catégorie trouvée
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelectCombobox;
