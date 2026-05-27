"use client";

import type { ReactNode } from "react";
import type { SectionId } from "@/lib/sections";

type SectionFrameProps = {
  id: SectionId;
  children: ReactNode;
  className?: string;
};

export function SectionFrame({ id, children, className = "" }: SectionFrameProps) {
  return (
    <div
      id={id}
      className={`h-[100dvh] overflow-x-hidden overflow-y-auto overscroll-contain ${className}`}
    >
      {children}
    </div>
  );
}
