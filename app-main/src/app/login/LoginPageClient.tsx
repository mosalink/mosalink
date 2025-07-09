"use client";
import { useSearchParams } from "next/navigation";
import Login from "@/components/specific/Login";

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  let errorMsg = "";
  if (errorParam === "CredentialsSignin") {
    errorMsg = "Email ou mot de passe incorrect.";
  }
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center gap-8">
      <h1 className="font-bold text-2xl">
        Bienvenue sur {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <Login />
    </div>
  );
}
