"use client";

import { ReactNode, useMemo } from "react";

const Board = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-40 p-10">{children}</div>
  );
};

export default Board;
