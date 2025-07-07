"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DomainWithDetails } from "@/hooks/super-admin/useQuerySuperAdminDomains";
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit,
  Search,
  UserPlus
} from "lucide-react";

interface DomainUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  creationDate: string;
  lastUpdateDate: string;
}

interface ManageUsersDialogProps {
  domain: DomainWithDetails;
}

export default function ManageUsersDialog({ domain }: ManageUsersDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<DomainUser | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [users, setUsers] = useState<DomainUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "USER" as "USER" | "ADMIN"
  });

  const { toast } = useToast();

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/super-admin/domains/${domain.id}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les utilisateurs quand le dialog s'ouvre
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchUsers();
    }
  };

  const filteredUsers = users
    .filter((user: DomainUser) => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Trier par rôle d'abord (ADMIN en premier), puis par nom/email
      if (a.role !== b.role) {
        return a.role === "ADMIN" ? -1 : 1;
      }
      // Si même rôle, trier par nom ou email
      const aName = a.name || a.email;
      const bName = b.name || b.email;
      return aName.localeCompare(bName);
    });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Erreur",
        description: "L'email est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/domains/${domain.id}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          domainId: domain.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès",
        });
        
        setFormData({ email: "", role: "USER" });
        setShowAddForm(false);
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/super-admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: formData.role,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Utilisateur modifié avec succès",
        });
        
        setShowEditForm(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la modification");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la modification",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`)) {
      try {
        const response = await fetch(`/api/super-admin/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Succès",
            description: "Utilisateur supprimé avec succès",
          });
          
          fetchUsers();
        } else {
          const error = await response.json();
          throw new Error(error.error || "Erreur lors de la suppression");
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    }
  };

  const startEdit = (user: DomainUser) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      role: user.role
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "USER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Gérer les utilisateurs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Gérer les utilisateurs - {domain.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowAddForm(true);
                setShowEditForm(false);
                setFormData({ email: "", role: "USER" });
              }}
              size="sm"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>

          {/* Formulaire d'ajout */}
          {showAddForm && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Ajouter un utilisateur</h4>
              <form onSubmit={handleAddUser} className="space-y-3">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="utilisateur@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value: "USER" | "ADMIN") => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Utilisateur</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Ajouter
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Formulaire de modification */}
          {showEditForm && selectedUser && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold mb-3">Modifier l&apos;utilisateur</h4>
              <form onSubmit={handleEditUser} className="space-y-3">
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value: "USER" | "ADMIN") => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Utilisateur</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Modifier
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowEditForm(false);
                      setSelectedUser(null);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste des utilisateurs */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">Chargement...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
              </div>
            ) : (
              filteredUsers.map((user: DomainUser) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name || user.email}</span>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    {user.name && (
                      <p className="text-sm text-gray-600">{user.email}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Créé le {new Date(user.creationDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
