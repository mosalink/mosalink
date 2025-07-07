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
import { Switch } from "@/components/ui/switch";
import { useMutationCreateDomain } from "@/hooks/super-admin/useMutationCreateDomain";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

export default function CreateDomainDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    isPublish: false,
    maximumCategories: 10,
    adminEmail: "",
  });

  const { toast } = useToast();
  const createDomainMutation = useMutationCreateDomain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      toast({
        title: "Erreur",
        description: "Le nom et l'URL du domaine sont requis",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDomainMutation.mutateAsync(formData);
      toast({
        title: "Succès",
        description: "Domaine créé avec succès",
      });
      setOpen(false);
      setFormData({
        name: "",
        url: "",
        isPublish: false,
        maximumCategories: 10,
        adminEmail: "",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Créer un domaine
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau domaine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du domaine *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom du domaine"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL du domaine *</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="URL du domaine"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email de l&apos;administrateur</Label>
            <Input
              id="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maximumCategories">Nombre maximum de catégories</Label>
            <Input
              id="maximumCategories"
              type="number"
              min="1"
              value={formData.maximumCategories}
              onChange={(e) => setFormData({ ...formData, maximumCategories: parseInt(e.target.value) || 10 })}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublish"
              checked={formData.isPublish}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublish: checked })}
            />
            <Label htmlFor="isPublish">Domaine publié</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createDomainMutation.isLoading}>
              {createDomainMutation.isLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
