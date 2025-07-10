import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useMutationUpdateDomain } from "@/hooks/super-admin/useMutationUpdateDomain";
import { useToast } from "@/components/ui/use-toast";

interface EditDomainDialogProps {
  domain: {
    id: string;
    name: string;
    url: string;
    isPublish: boolean;
    maximumCategories: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditDomainDialog({ domain, open, onOpenChange }: EditDomainDialogProps) {
  const [name, setName] = useState(domain.name);
  const [url, setUrl] = useState(domain.url);
  const [isPublish, setIsPublish] = useState(domain.isPublish);
  const [maximumCategories, setMaximumCategories] = useState(domain.maximumCategories);
  const { toast } = useToast();
  const updateDomain = useMutationUpdateDomain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDomain.mutateAsync({
        id: domain.id,
        name,
        url,
        isPublish,
        maximumCategories,
      });
      toast({ title: "Succès", description: "Domaine modifié avec succès" });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le domaine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">URL</label>
            <Input value={url} onChange={e => setUrl(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Nombre max. de catégories</label>
            <Input type="number" value={maximumCategories} min={1} onChange={e => setMaximumCategories(Number(e.target.value))} required />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isPublish} onCheckedChange={setIsPublish} />
            <span>{isPublish ? "Publié" : "Privé"}</span>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={updateDomain.isLoading}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
