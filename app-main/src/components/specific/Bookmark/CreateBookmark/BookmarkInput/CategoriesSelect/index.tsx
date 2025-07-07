import { Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useQueryCategoriesDomain } from "@/hooks/useCategory";
import { CategorySelectCombobox } from "@/components/ui/category-select-combobox";

interface Props {
  setCategoryId: Dispatch<SetStateAction<string | undefined>>;
  categoryId?: string;
}

const CategoriesSelect = ({ setCategoryId, categoryId }: Props) => {
  const { data: session } = useSession();
  const params = useParams();
  
  const domainUrl = (params?.domain as string) || session?.user?.domainUrl || '';
  
  const { data: categories = [] } = useQueryCategoriesDomain(domainUrl);

  return (
    <CategorySelectCombobox
      categories={categories}
      selectedCategoryId={categoryId}
      onCategorySelect={setCategoryId}
      placeholder="Choisir une catégorie..."
      className="w-full"
    />
  );
};

export default CategoriesSelect;
