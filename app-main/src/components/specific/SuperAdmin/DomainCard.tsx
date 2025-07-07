"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DomainWithDetails } from "@/hooks/super-admin/useQuerySuperAdminDomains";
import { useMutationDeleteDomain } from "@/hooks/super-admin/useMutationDeleteDomain";
import { useToast } from "@/components/ui/use-toast";
import { 
  Trash2, 
  Users, 
  BookmarkIcon, 
  Folder,
  Globe,
} from "lucide-react";
import ManageUsersDialog from "./ManageUsersDialog";

interface DomainCardProps {
  domain: DomainWithDetails;
}

export default function DomainCard({ domain }: DomainCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const deleteDomainMutation = useMutationDeleteDomain();

  const handleDeleteDomain = async () => {
    if (domain.name === "super-admin") {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le domaine super-admin",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteDomainMutation.mutateAsync(domain.id);
      toast({
        title: "Succès",
        description: "Domaine supprimé avec succès",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <>
      <Card className="w-full border rounded-lg bg-white shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Globe className="h-5 w-5" />
                {domain.name}
                {domain.isPublish ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">Publié</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">Privé</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                URL: {domain.url} | Créé le {formatDate(domain.creationDate)}
              </CardDescription>
            </div>
            {domain.name !== "super-admin" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{domain._count.users} utilisateurs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Folder className="h-4 w-4 text-green-500" />
                <span>{domain._count.categories} catégories</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookmarkIcon className="h-4 w-4 text-orange-500" />
                <span>{domain._count.bookmark} signets</span>
              </div>
            </div>

            {/* Limites */}
            <div className="text-sm text-gray-600">
              Limite de catégories: {domain.maximumCategories}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <ManageUsersDialog domain={domain} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de suppression de domaine */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le domaine</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le domaine &quot;{domain.name}&quot; ? 
              Cette action est irréversible et supprimera tous les utilisateurs, 
              catégories et signets associés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteDomain}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
