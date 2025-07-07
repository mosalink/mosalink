import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import DomainBoard from "@/components/specific/Board/DomainBoard";

interface Props {
  params: { domain: string };
}

const Page = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  return <DomainBoard id={session?.user.id || ""} domain={params.domain} />;
};

export default Page;
