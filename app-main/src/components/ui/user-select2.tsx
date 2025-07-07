"use client";

import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Plus, Trash2, Edit3, Check, X, User, Mail, Shield, Crown } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
enum Role {
  USER = "USER",
  MODERATOR = "MODERATOR", 
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

interface User {
  id: string;
  email: string;
  role: Role;
}

interface UserSelect2Props {
  users: User[];
  onCreateUser: (email: string, role: Role) => void;
  onUpdateUser: (id: string, email: string, role: Role) => void;
  onDeleteUser: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

const getRoleIcon = (role: Role) => {
  switch (role) {
    case Role.ADMIN:
      return <Crown className="h-4 w-4" />;
    case Role.USER:
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const getRoleLabel = (role: Role) => {
  switch (role) {
    case Role.ADMIN:
      return "Administrateur";
    case Role.USER:
      return "Utilisateur";
    default:
      return "Utilisateur";
  }
};

const getRoleBadgeVariant = (role: Role) => {
  switch (role) {
    case Role.ADMIN:
      return "default";
    case Role.USER:
      return "secondary";
    default:
      return "secondary";
  }
};

export const UserSelect2 = ({
  users = [],
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  isLoading = false,
  className,
}: UserSelect2Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>(Role.USER);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState("");
  const [editingRole, setEditingRole] = useState<Role>(Role.USER);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const newUserInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = users
    .filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Trier pour mettre les administrateurs en haut
      if (a.role === Role.ADMIN && b.role !== Role.ADMIN) return -1;
      if (a.role !== Role.ADMIN && b.role === Role.ADMIN) return 1;
      return 0;
    });

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    if (isAddingNew && newUserInputRef.current) {
      newUserInputRef.current.focus();
    }
  }, [isAddingNew]);

  const handleCreateUser = useCallback(() => {
    if (newUserEmail.trim() && newUserEmail.includes("@")) {
      onCreateUser(newUserEmail.trim(), newUserRole);
      setNewUserEmail("");
      setNewUserRole(Role.USER);
      setIsAddingNew(false);
    }
  }, [newUserEmail, newUserRole, onCreateUser]);

  const handleUpdateUser = useCallback(
    (id: string) => {
      if (editingEmail.trim() && editingEmail.includes("@")) {
        onUpdateUser(id, editingEmail.trim(), editingRole);
        setEditingId(null);
        setEditingEmail("");
        setEditingRole(Role.USER);
      }
    },
    [editingEmail, editingRole, onUpdateUser]
  );

  const startEditing = useCallback((user: User) => {
    setEditingId(user.id);
    setEditingEmail(user.email);
    setEditingRole(user.role);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditingEmail("");
    setEditingRole(Role.USER);
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
          setNewUserEmail("");
          setNewUserRole(Role.USER);
        }
      }
    },
    [editingId, isAddingNew, cancelEditing]
  );

  const isValidEmail = (email: string) => {
    return email.includes("@") && email.includes(".");
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gestion des Utilisateurs ({users.length})</span>
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
            placeholder="Rechercher un utilisateur par email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isAddingNew && (
          <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-primary/20">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input
                ref={newUserInputRef}
                type="email"
                placeholder="Email de l'utilisateur"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleCreateUser)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Select value={newUserRole} onValueChange={(value: Role) => setNewUserRole(value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.ADMIN}>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Administrateur
                    </div>
                  </SelectItem>
                  <SelectItem value={Role.USER}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Utilisateur
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button
                size="sm"
                onClick={handleCreateUser}
                disabled={!newUserEmail.trim() || !isValidEmail(newUserEmail)}
              >
                <Check className="h-4 w-4 mr-2" />
                Créer
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewUserEmail("");
                  setNewUserRole(Role.USER);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? (
                <>
                  Aucun utilisateur trouvé pour &ldquo;{searchTerm}&rdquo;
                  {isValidEmail(searchTerm) && (
                    <>
                      <br />
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setNewUserEmail(searchTerm);
                          setIsAddingNew(true);
                          setSearchTerm("");
                        }}
                        className="mt-2"
                      >
                        Inviter &ldquo;{searchTerm}&rdquo;
                      </Button>
                    </>
                  )}
                </>
              ) : (
                "Aucun utilisateur créé"
              )}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {editingId === user.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          ref={editInputRef}
                          type="email"
                          value={editingEmail}
                          onChange={(e) => setEditingEmail(e.target.value)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () => handleUpdateUser(user.id))
                          }
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <Select value={editingRole} onValueChange={(value: Role) => setEditingRole(value)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Role.ADMIN}>
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4" />
                                Administrateur
                              </div>
                            </SelectItem>
                            <SelectItem value={Role.USER}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Utilisateur
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateUser(user.id)}
                          disabled={!editingEmail.trim() || !isValidEmail(editingEmail)}
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
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <Badge 
                        variant={getRoleBadgeVariant(user.role)} 
                        className="flex items-center gap-1"
                      >
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  )}
                </div>

                {editingId !== user.id && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(user)}
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
                            Supprimer l&apos;utilisateur &ldquo;{user.email}&rdquo;
                          </DialogTitle>
                          <DialogDescription>
                            Cette action est irréversible. Tous les signets de cet
                            utilisateur seront également supprimés.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => onDeleteUser(user.id)}
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

export default UserSelect2;
