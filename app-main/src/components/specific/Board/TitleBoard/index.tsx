import { cn } from "@/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const TitleBoard = ({ children, className }: Props) => {
  return (
    <h1
      className={cn(
        className,
        "rounded-full px-4 py-2 text-center text-2xl font-bold flex justify-center"
      )}
    >
      {children}
    </h1>
  );
};

export default TitleBoard;
