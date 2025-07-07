import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useMutationDeleteCategory } from "@/hooks/category/useMutationDeleteCategory";
import { useMutationModifyCategory } from "@/hooks/category/useMutationModifyCategory";
import { getNameToUrl } from "@/utils/url/utils";
import { useCallback, useState } from "react";

interface Props {
  id: string;
  name: string;
}

const CategoryItem = ({ id, name }: Props) => {
  const deleteCategoryMutation = useMutationDeleteCategory();
  const modifyCategoryMutation = useMutationModifyCategory();

  const [newCategorieName, setNewCategorieName] = useState(name);

  const handleModifyCategory = useCallback(() => {
    modifyCategoryMutation.mutate({
      name: newCategorieName,
      url: getNameToUrl(newCategorieName),
      id,
    });
  }, [id, modifyCategoryMutation, newCategorieName]);

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      deleteCategoryMutation.mutate(categoryId);
    },
    [deleteCategoryMutation]
  );
  return (
    <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between md:items-center">
      <div className="flex gap-2 items-center">
        <p
          className="truncate line-clamp-1"
          contentEditable
          onInput={(e) => {
            setNewCategorieName(e.currentTarget.innerHTML);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleModifyCategory();
            }
          }}
        >
          {newCategorieName}
        </p>
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⏎</span>
          </kbd>{" "}
          to save
        </p>
      </div>

      <Dialog>
        <DialogTrigger className="text-red-500 text-sm font-bold cursor-pointer">
          Supprimer
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Voulez vous vraiment supprimer cette Catégorie ?
            </DialogTitle>
            <DialogDescription>
              En supprimant la Catégorie {name}, vous allez supprimer toutes les
              liens qui sont dans cette Catégorie
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              type="submit"
              onClick={() => handleDeleteCategory(id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Separator className="md:hidden" />
    </div>
  );
};

export default CategoryItem;
