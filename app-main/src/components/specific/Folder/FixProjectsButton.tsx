import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export const FixProjectsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const { toast } = useToast();

  const handleFixProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${routeIndexFront}/api/folder/fix-owner`, {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Projets corrigés !",
          description: result.message,
        });
        setIsFixed(true);
        setTimeout(() => setIsFixed(false), 3000);
      } else {
        throw new Error(result.error || "Erreur lors de la correction");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de corriger les projets",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFixProjects}
      disabled={isLoading}
      variant={isFixed ? "default" : "outline"}
      size="sm"
      className="ml-2"
      title="Corrige les anciens projets pour s'assurer que vous apparaissez dans la liste des membres"
    >
      {isLoading ? (
        <>
          <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
          Correction...
        </>
      ) : isFixed ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Corrigé !
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 mr-2" />
          Corriger
        </>
      )}
    </Button>
  );
};
