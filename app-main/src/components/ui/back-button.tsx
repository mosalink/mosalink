"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
}

const BackButton = ({ 
  className, 
  children, 
  variant = "ghost", 
  size = "sm",
  onClick 
}: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("gap-2 hover:bg-gray-100 transition-colors", className)}
      aria-label="Retour à la page précédente"
    >
      <ChevronLeft className="h-4 w-4" />
      {children || "Retour"}
    </Button>
  );
};

export default BackButton;
