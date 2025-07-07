"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { Search, ChevronDown, User, Check } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserSearchSelectProps {
  users: User[];
  value?: string;
  onValueChange: (userId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const UserSearchSelect = ({
  users = [],
  value,
  onValueChange,
  placeholder = "Sélectionner un utilisateur",
  className,
  disabled = false,
}: UserSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedUser = users.find((user) => user.id === value);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = useCallback((userId: string) => {
    onValueChange(userId);
    setOpen(false);
    setSearchTerm("");
  }, [onValueChange]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              <span className="truncate">{selectedUser.email}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        {/* Barre de recherche */}
        <div className="flex items-center border-b p-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        {/* Liste des utilisateurs */}
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {searchTerm ? "Aucun utilisateur trouvé." : "Aucun utilisateur disponible."}
            </div>
          ) : (
            <div className="py-1">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelect(user.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    value === user.id && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user.email}</div>
                    {user.name && (
                      <div className="text-sm text-muted-foreground truncate">
                        {user.name}
                      </div>
                    )}
                  </div>
                  {value === user.id && (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserSearchSelect;
