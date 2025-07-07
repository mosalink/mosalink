import SessionContext from "@/context/SessionContext";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import QueryContext from "@/context/QueryContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | créez des liens collaboratifs`,
  description: `${process.env.NEXT_PUBLIC_APP_NAME} vous permet de créer des liens en collaboration avec vos collègues`,
  manifest: "/manifest.json",
  themeColor: "#5B0B53",
  icons: "/icon-256x256.png",
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="fr">
      <SessionContext>
        <QueryContext>
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </QueryContext>
      </SessionContext>
    </html>
  );
}
