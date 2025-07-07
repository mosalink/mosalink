import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  routeCategorieFront,
  routeUserFront,
} from "@/utils/routes/routesFront";

type Category = {
  id: string;
  name: string;
  url: string;
  isPublish: boolean;
  domainId: string;
  creationDate: Date;
  lastUpdateDate: Date;
};

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MyProjets from "../../Folder/Dialog/MyProjets";

interface Props {
  domain: string;
  categories: Category[];
}

const Navigation = ({ domain, categories }: Props) => {
  const { data: dataSession } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getColumnClass = () => {
    const categoryCount = categories.length;
    
    if (categoryCount < 4) {
      return "grid-cols-1";
    } else if (categoryCount < 8) {
      return "grid-cols-1 sm:grid-cols-2";
    } else {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getDropdownWidth = () => {
    const categoryCount = categories.length;
    
    if (categoryCount < 4) {
      return "w-fit min-w-[200px] max-w-[400px]";
    } else if (categoryCount < 8) {
      return "w-fit min-w-[400px] max-w-[600px]";
    } else {
      return "w-fit min-w-[600px] max-w-[900px]";
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1 flex-col-reverse items-start md:items-center md:gap-0 md:flex-row">
        {categories.length > 0 && (
          <DropdownMenu 
            open={dropdownOpen} 
            onOpenChange={setDropdownOpen}
          >
            <DropdownMenuTrigger 
              className={`${navigationMenuTriggerStyle()} flex items-center gap-1`}
              onMouseEnter={() => setDropdownOpen(true)}
            >
              Catégories
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className={`${getDropdownWidth()} max-h-96 overflow-y-auto p-3`}
              align="start"
              sideOffset={8}
              onMouseLeave={() => {
                setTimeout(() => setDropdownOpen(false), 200);
              }}
            >
              <div className={`grid ${getColumnClass()} gap-2`}>
                {categories?.map((categorie) => (
                  <DropdownMenuItem key={categorie.id} asChild>
                    <Link 
                      href={routeCategorieFront(domain, categorie.url)}
                      className="w-full p-3 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors cursor-pointer text-sm whitespace-nowrap"
                    >
                      {categorie.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Link
          href={routeUserFront(domain, dataSession?.user.id || '')}
          legacyBehavior
          passHref
        >
          <NavigationMenuItem
            className={`${navigationMenuTriggerStyle()} cursor-pointer`}
          >
            Mon tableau
          </NavigationMenuItem>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <NavigationMenuItem
              className={`${navigationMenuTriggerStyle()} cursor-pointer`}
            >
              Mes projets
            </NavigationMenuItem>
          </DialogTrigger>
          <MyProjets />
        </Dialog>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
