"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useMemo, useState, useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");

  // de ici
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  //   const handleDevLogin = async (e: React.MouseEvent) => {
  //   e.preventDefault();
    
  //   try {
  //     const response = await fetch('/api/dev-login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     const data = await response.json();

  //     if (response.ok && data.success) {
  //       window.location.href = data.redirectUrl || '/';
  //     } else {
  //       console.error('Erreur de connexion dev:', data.error);
  //       alert(`Erreur: ${data.error}`);
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la connexion dev:', error);
  //     alert('Erreur de connexion');
  //   }
  // };
  // jusqu'ici

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
        Connection avec Email
      </Button>

      {/* de ici */}
      {/* {isClient && (
        <Button
          disabled={!isEmailValid}
          onClick={handleDevLogin}
          variant="outline"
          type="button"
        >
          🚀 Connexion Directe (Dev)
        </Button>
      )} */}
      {/* jusqu'ici */}
    </form>
  );
};

export default Login;
