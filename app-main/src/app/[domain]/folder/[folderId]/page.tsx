import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FolderBoard from "@/components/specific/Board/FolderBoard";

interface Props {
  params: {
    folderId: string;
  };
}

const Page = async ({ params }: Props) => {
  return <FolderBoard id={params.folderId} />;
};

export default Page;
