"use client";

import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Plus, Trash2, Edit3, Check, X } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

interface Category {
  id: string;
  name: string;
}

interface CategorySelect2Props {
  categories: Category[];
  onCreateCategory: (name: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const CategorySelect2 = ({
  categories = [],
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isLoading = false,
  className,
}: CategorySelect2Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    if (isAddingNew && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus();
    }
  }, [isAddingNew]);

  const handleCreateCategory = useCallback(() => {
    if (newCategoryName.trim()) {
      onCreateCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsAddingNew(false);
    }
  }, [newCategoryName, onCreateCategory]);

  const handleUpdateCategory = useCallback(
    (id: string) => {
      if (editingName.trim()) {
        onUpdateCategory(id, editingName.trim());
        setEditingId(null);
        setEditingName("");
      }
    },
    [editingName, onUpdateCategory]
  );

  const startEditing = useCallback((category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditingName("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, action: () => void) => {
      if (e.key === "Enter") {
        e.preventDefault();
        action();
      } else if (e.key === "Escape") {
        if (editingId) {
          cancelEditing();
        } else if (isAddingNew) {
          setIsAddingNew(false);
          setNewCategoryName("");
        }
      }
    },
    [editingId, isAddingNew, cancelEditing]
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gestion des Catégories ({categories.length})</span>
          <Button
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
            disabled={isAddingNew}
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={searchInputRef}
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isAddingNew && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-primary/20">
            <Input
              ref={newCategoryInputRef}
              placeholder="Nom de la nouvelle catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleCreateCategory)}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAddingNew(false);
                setNewCategoryName("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? (
                <>
                  Aucune catégorie trouvée pour &ldquo;{searchTerm}&rdquo;
                  <br />
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setNewCategoryName(searchTerm);
                      setIsAddingNew(true);
                      setSearchTerm("");
                    }}
                    className="mt-2"
                  >
                    Créer &ldquo;{searchTerm}&rdquo;
                  </Button>
                </>
              ) : (
                "Aucune catégorie créée"
              )}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {editingId === category.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={editInputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => handleUpdateCategory(category.id))
                        }
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateCategory(category.id)}
                        disabled={!editingName.trim()}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-medium">
                        {category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                {editingId !== category.id && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Supprimer la catégorie &ldquo;{category.name}&rdquo;
                          </DialogTitle>
                          <DialogDescription>
                            Cette action est irréversible. Tous les signets de cette
                            catégorie seront également supprimés.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => onDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer définitivement
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Raccourcis clavier */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Entrée</kbd>{" "}
            pour sauvegarder •{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Échap</kbd>{" "}
            pour annuler
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySelect2;
