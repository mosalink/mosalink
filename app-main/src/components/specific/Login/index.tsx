"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useMemo, useState, useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");

  const isEmailValid = useMemo(() => {
    return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);
  }, [email]);

  return (
    <form className="flex flex-col gap-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-96"
        placeholder="Votre email"
        required
      />
      <Button
        disabled={!isEmailValid}
        onClick={async (e) => {
          e.preventDefault();
          try {
            const result = await signIn("email", { 
              email: email,
              redirect: false,
              callbackUrl: "/"
            });
            
            if (result?.ok) {
              window.location.href = "/auth/verify-request";
            }
          } catch (error) {
            console.error("Erreur lors de la connexion:", error);
          }
        }}
        type="submit"
      >
        Connexion par e-mail
      </Button>
    </form>
  );
};

export default Login;
