import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TagBoard from "@/components/specific/Board/TagBoard";

interface Props {
  params: {
    tagName: string;
  };
}

const Page = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  return <TagBoard id={params.tagName} />;
};

export default Page;
