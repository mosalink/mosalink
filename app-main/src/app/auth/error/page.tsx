import { AlertCircle } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8">
      <AlertCircle className="h-12 w-12" />
      <h1 className="font-bold text-2xl">Oups,</h1>
      <p>Une erreur est survenue</p>
    </div>
  );
};

export default ErrorPage;
