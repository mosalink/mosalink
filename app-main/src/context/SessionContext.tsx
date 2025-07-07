"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export default function SessionContext({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
