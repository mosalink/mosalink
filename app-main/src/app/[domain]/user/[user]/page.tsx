import UserBoard from "@/components/specific/Board/UserBoard";
import { getServerSession } from "next-auth";
import Board from "@/components/specific/Board";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  params: {
    user: string;
  };
}

const Page = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  return <UserBoard id={params.user} />;
};

export default Page;
