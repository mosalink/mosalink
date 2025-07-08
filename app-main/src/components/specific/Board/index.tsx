"use client";

import { ReactNode } from "react";

const Board = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-6 w-full">
      {children}
    </div>
  );
};

export default Board;
