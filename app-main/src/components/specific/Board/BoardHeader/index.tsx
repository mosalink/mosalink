"use client";

import { ReactNode } from "react";
import BackButton from "@/components/ui/back-button";
import TitleBoard from "../TitleBoard";

interface BoardHeaderProps {
  title: ReactNode;
  titleClassName?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const BoardHeader = ({ 
  title, 
  titleClassName, 
  showBackButton = true, 
  onBackClick 
}: BoardHeaderProps) => {
  return (
    <div className="w-full max-w-6xl space-y-4">
      {showBackButton && (
        <div className="flex justify-start">
          <BackButton onClick={onBackClick} />
        </div>
      )}
      <div className="flex justify-center">
        <TitleBoard className={titleClassName}>{title}</TitleBoard>
      </div>
    </div>
  );
};

export default BoardHeader;
