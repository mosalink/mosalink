"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!passwordValid) {
      setError("Le mot de passe n'est pas assez fort.");
      return;
    }
    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword, token }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Erreur lors de la réinitialisation.");
      }
    } catch (e) {
      setError("Erreur lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return <div className="p-8 text-center text-red-600">Lien invalide ou expiré.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md p-8 border rounded bg-white shadow">
        <h1 className="text-xl font-bold mb-2">Réinitialiser le mot de passe</h1>
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="relative w-full">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            tabIndex={-1}
            onClick={() => setShowConfirmPassword(v => !v)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <ul className="text-xs text-gray-500 mb-2">
          <li className={password.length >= 8 ? 'text-green-600' : 'text-red-600'}>Minimum 8 caractères</li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}>Une majuscule</li>
          <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}>Une minuscule</li>
          <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}>Un chiffre</li>
        </ul>
        {confirmPassword.length > 0 && (
          <p className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
            {passwordsMatch ? 'Les mots de passe correspondent.' : 'Les mots de passe ne correspondent pas.'}
          </p>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Mot de passe réinitialisé ! Redirection...</div>}
        <Button type="submit" disabled={loading || !passwordValid || !passwordsMatch} className="w-full">
          {loading ? "Réinitialisation..." : "Réinitialiser"}
        </Button>
      </form>
    </div>
  );
}
