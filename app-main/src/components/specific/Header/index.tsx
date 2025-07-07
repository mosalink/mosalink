"use client";

import { useSession } from "next-auth/react";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import { useQueryCategoriesDomain } from "@/hooks/useCategory";
import { useParams } from "next/navigation";
import { Domain } from "@prisma/client";

interface Props {
  currentDomain?: Domain;
}

const Header = ({ currentDomain }: Props) => {
  const { data: dataSession } = useSession();
  const params = useParams();

  const domainUrl = currentDomain?.url || (params?.domain as string) || dataSession?.user.domainUrl || '';
  const domainName = currentDomain?.name || dataSession?.user.domainName || '';

  const { data: allCategories } = useQueryCategoriesDomain(domainUrl);

  return (
    <header className="w-full sticky top-0 left-0 px-4">
      <HeaderDesktop
        domainUrl={domainUrl}
        domainName={domainName}
        allCategories={allCategories}
      />
      <HeaderMobile
        domainUrl={domainUrl}
        domainName={domainName}
        allCategories={allCategories}
      />
    </header>
  );
};

export default Header;
