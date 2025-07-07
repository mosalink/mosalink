import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  routeCreateBookmarkFront,
  routeDomainFront,
  routeIndexFront,
} from "@/utils/routes/routesFront";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../Navigation";
import { Button } from "@/components/ui/button";
import { AlignJustify, Plus } from "lucide-react";
import UserNav from "../UserNav";
import { usePathname, useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

interface Props {
  domainUrl: string;
  domainName: string;
  allCategories?: Category[];
}

const HeaderMobile = ({ domainUrl, domainName, allCategories }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex py-6 md:hidden items-center justify-between bg-white">
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
      </div>
      <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
        <SheetTrigger>
          <AlignJustify className="w-6 h-6" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <Button
                className="p-2 flex gap-2"
                onClick={() => router.push(routeCreateBookmarkFront(domainUrl))}
              >
                <Plus className="w-5 h-5" /> Insérer un lien
              </Button>
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col justify-between items-start gap-4 py-10">
            <div>
              <Navigation domain={domainUrl} categories={allCategories ?? []} />
            </div>

            <UserNav />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HeaderMobile;
