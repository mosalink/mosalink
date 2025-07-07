"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isAdminDomain, isSuperAdmin } from "@/utils/roles/utils";
import { routeAdminFront } from "@/utils/routes/routesFront";
import { LogOut, User, UserCog, Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const UserNav = () => {
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-2">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-4 p-2">
          <div className="space-y-1">
            <p className="font-bold text-sm">Mon adresse mail</p>
            <p className="text-sm">{session.data?.user.email ?? ""}</p>
          </div>
          <div className="flex flex-col gap-1">
            <DropdownMenuSeparator />
            {session.data &&
              isSuperAdmin(session.data.user) && (
                <DropdownMenuItem asChild>
                  <Link href="/super-admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Super Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
            {session.data &&
              !isSuperAdmin(session.data.user) &&
              isAdminDomain(session.data.user, session.data.user.domainId) && (
                <DropdownMenuItem asChild>
                  <Link href={routeAdminFront(session.data.user.domainUrl)}>
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}

            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
