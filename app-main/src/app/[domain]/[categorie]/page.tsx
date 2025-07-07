import CategoryBoard from "@/components/specific/Board/CategoryBoard";

interface Props {
  params: {
    domain: string;
    categorie: string;
  };
}

export default async function Categorie({ params }: Props) {
  return <CategoryBoard id={params.categorie} domain={params.domain} />;
}
