import {
  routeCreateBookmarkFront,
  routeDomainFront,
  routeIndexFront,
} from "@/utils/routes/routesFront";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../Navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UserNav from "../UserNav";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";

interface Props {
  domainUrl: string;
  domainName: string;
  allCategories?: Category[];
}

const HeaderDesktop = ({ domainUrl, domainName, allCategories }: Props) => {
  const router = useRouter();

  return (
    <div className="hidden py-6 md:flex items-center justify-between bg-white w-full lg:px-20">
      <div className="flex items-center gap-10">
        <Link href={routeIndexFront}>
          <Image
            src={"/icon-192x192.png"}
            alt={process.env.APP_NAME ?? ""}
            width={40}
            height={40}
          />
        </Link>
        <Link className="font-bold" href={routeDomainFront(domainUrl)}>
          {domainName}
        </Link>
        <div>
          <Navigation domain={domainUrl} categories={allCategories ?? []} />
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          className="p-2 flex gap-2"
          onClick={() => router.push(routeCreateBookmarkFront(domainUrl))}
        >
          <Plus className="w-5 h-5" /> Insérer un lien
        </Button>
        <div className="hidden md:block">
          <UserNav />
        </div>
      </div>
    </div>
  );
};

export default HeaderDesktop;
