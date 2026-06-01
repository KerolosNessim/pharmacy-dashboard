import { ReactNode } from "react";

/** Hidden on screen; shown only when printing (see globals.css). */
export function PrintHidden({ children }: { children: ReactNode }) {
  return <div className="print-hidden-screen hidden">{children}</div>;
}
