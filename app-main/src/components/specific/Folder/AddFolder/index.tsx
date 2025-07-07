import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutationCreateFolder } from "@/hooks/folder/useMutationCreateFolder";
import { getNameToUrl } from "@/utils/url/utils";
import { useCallback, useState } from "react";

const AddFolder = () => {
  const createFolderMutation = useMutationCreateFolder();

  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = useCallback(
    (e: any) => {
      if (!newFolderName.trim()) {
        e.preventDefault();
        return;
      }
      
      createFolderMutation.mutate({
        name: newFolderName,
        url: getNameToUrl(newFolderName),
      });
      
      setNewFolderName(""); // Vider le champ après la soumission
      e.preventDefault();
    },
    [createFolderMutation, newFolderName]
  );

  return (
    <div className="flex flex-col gap-4 py-4">
      <p className="text-md text-slate-900 font-bold">
        Ajouter un nouveau projet
      </p>
      <form className="flex gap-2">
        <Input
          type="text"
          placeholder="Nouveau projet"
          required
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <Button type="submit" className="w-80" onClick={handleCreateFolder}>
          Ajouter un projet
        </Button>
      </form>
    </div>
  );
};

export default AddFolder;
