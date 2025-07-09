"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Category } from "../../../lib/types";

interface CategorySelectProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Callback pour gérer le changement de la valeur de recherche
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search input changed:", value);
    setSearchValue(value);
  }, []);

  // Focus sur l'input de recherche quand le dropdown s'ouvre
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    if (open) {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpen(false);
          setSearchValue("");
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const selectedCategory = categories.find(cat => 
    cat.id === selectedCategoryId
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Debug temporaire
  console.log("Search debug:", {
    searchValue,
    allCategories: categories.map(c => c.name),
    filteredCategories: filteredCategories.map(c => c.name),
    filterCount: filteredCategories.length
  });

  return (
    <div className="relative" ref={dropdownRef}>
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
        onClick={() => setOpen(!open)}
      >
        <span>
          {selectedCategory ? selectedCategory.name : placeholder}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {open && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 w-full min-w-[200px] p-2 z-[1000] bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <div className="relative mb-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tapez pour rechercher une catégorie..."
              value={searchValue}
              onChange={handleSearchChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                  setSearchValue("");
                }
                console.log("Key pressed:", e.key);
              }}
              onFocus={() => console.log("Input focused")}
              onBlur={() => console.log("Input blurred")}
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Catégories
                </div>
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Category clicked:", category.name);
                      onCategorySelect(category.id);
                      setSearchValue("");
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-2 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center",
                      selectedCategoryId === category.id && "bg-gray-100"
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
      )}
    </div>
  );
};

export default CategorySelectCombobox;
