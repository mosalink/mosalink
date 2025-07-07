import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutationCreateCategory } from "@/hooks/category/useMutationCreateCategory";
import { useQueryCategoriesAdmin } from "@/hooks/category/useQueryCategoriesAdmin";
import { getNameToUrl } from "@/utils/url/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryItem from "./CategoryItem";

const CategoryManage = () => {
  const { data, isLoading, isError } = useQueryCategoriesAdmin();
  const createCategoryMutation = useMutationCreateCategory();
  const [numberOfCategories, setNumberOfCategories] = useState(0);
  const [newCategorieName, setNewCategorieName] = useState("");

  useEffect(() => {
    setNumberOfCategories(data?.length ?? 0);
  }, [data?.length]);

  const handleCreateCategory = useCallback(() => {
    createCategoryMutation.mutate({
      name: newCategorieName,
      url: getNameToUrl(newCategorieName),
    });
  }, [createCategoryMutation, newCategorieName]);

  return (
    <div className="flex flex-col gap-4 border rounded-md p-8">
      <h2 className="text-xl font-bold">
        Les {numberOfCategories} Catégorie(s)
      </h2>
      <div className="flex flex-col md-flex-row gap-4">
        <Input
          type="text"
          placeholder="Nom de la Catégorie"
          onChange={(e) => setNewCategorieName(e.target.value)}
          required
        />
        <Button className="w-auto md:w-80" onClick={handleCreateCategory}>
          Ajouter une Catégorie
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:gap-2">
        {data &&
          data.map(({ name, id }) => (
            <CategoryItem key={id} name={name} id={id} />
          ))}
      </div>
    </div>
  );
};

export default CategoryManage;
