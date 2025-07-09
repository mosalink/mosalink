"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useMemo, useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "password" | "create-password">("email");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const isEmailValid = useMemo(() => {
    return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);
  }, [email]);

  useEffect(() => {
    if (isEmailValid) {
      (async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/auth/check-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await response.json();
          setHasPassword(data.hasPassword);
        } catch (e) {
          setHasPassword(false);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setHasPassword(false);
    }
  }, [email, isEmailValid]);

  const handlePasswordLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.ok) {
        window.location.href = "/";
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (error) {
      setError("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = async () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await response.json();
      if (data.success) {
        await handlePasswordLogin();
      } else {
        setError(data.error || "Erreur lors de la création du mot de passe");
      }
    } catch (error) {
      setError("Erreur lors de la création du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    setResetError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) setResetSent(true);
      else setResetError(data.error || "Erreur lors de l'envoi du mail");
    } catch (e) {
      setResetError("Erreur lors de l'envoi du mail");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">Connexion</h1>
        <p className="text-gray-500 mb-6 text-center">Accédez à votre espace personnel</p>
        {step === "email" || !isEmailValid ? (
          <>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              placeholder="Votre email"
              required
            />
            {isEmailValid && (
              <>
                <Button
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
                      setError("Erreur lors de la connexion par email");
                    }
                  }}
                  disabled={loading}
                  className="w-full mb-2"
                >
                  Connexion par e-mail
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (hasPassword) {
                      setStep("password");
                    } else {
                      setStep("create-password");
                    }
                  }}
                  disabled={loading}
                  className="w-full"
                >
                  Connexion par mot de passe
                </Button>
              </>
            )}
            {error && <p className="text-red-500 text-sm mt-4 text-center w-full">{error}</p>}
          </>
        ) : null}
        {step === "password" && (
          <>
            <p className="text-center text-gray-600 mb-2">
              Entrez votre mot de passe pour <strong>{email}</strong>
            </p>
            <div className="relative w-full mb-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                placeholder="Mot de passe"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button
              className="w-full mb-2"
              disabled={!password || loading}
              onClick={(e) => {
                e.preventDefault();
                handlePasswordLogin();
              }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            <div className="w-full text-right mb-2">
              {resetSent ? (
                <span className="text-green-600 text-xs">Un email de réinitialisation a été envoyé.</span>
              ) : (
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                >
                  Mot de passe oublié&nbsp;?
                </button>
              )}
              {resetError && <p className="text-red-500 text-xs mt-1">{resetError}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mb-2"
              onClick={() => setStep("email")}
            >
              &larr; Retour
            </Button>
            {error && (
              <p className="text-red-600 text-base font-semibold text-center mt-2 w-full">{error}</p>
            )}
          </>
        )}
        {step === "create-password" && (
          <>
            <p className="text-center text-gray-600 mb-2">
              Créez un mot de passe pour <strong>{email}</strong>
            </p>
            <div className="w-full text-xs text-gray-500 mb-2">
              <ul className="list-disc ml-4">
                <li className={password.length >= 8 ? 'text-green-600' : 'text-red-600'}>Minimum 8 caractères</li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}>Une majuscule</li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}>Une minuscule</li>
                <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}>Un chiffre</li>
              </ul>
            </div>
            <div className="relative w-full mb-2">
              <Input
                type={showCreatePassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                placeholder="Créer le mot de passe"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowCreatePassword((v) => !v)}
              >
                {showCreatePassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative w-full mb-2">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
                placeholder="Confirmer le mot de passe"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p className={`text-sm ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}> 
                {password === confirmPassword ? 'Les mots de passe correspondent.' : 'Les mots de passe ne correspondent pas.'}
              </p>
            )}
            <Button
              className="w-full mb-2"
              disabled={!password || !confirmPassword || loading || password !== confirmPassword || password.length < 8}
              onClick={(e) => {
                e.preventDefault();
                handleCreatePassword();
              }}
            >
              {loading ? "Création..." : "Créer le mot de passe"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setStep("email")}
            >
              &larr; Retour
            </Button>
            {error && <p className="text-red-500 text-sm mt-2 w-full">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
