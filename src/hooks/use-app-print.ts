"use client";

import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { isIOS, PRINT_PAGE_STYLE } from "@/lib/print";

type UseAppPrintOptions = {
  contentRef: React.RefObject<HTMLDivElement | null>;
  documentTitle: string;
};

/**
 * Desktop/Android: react-to-print iframe.
 * iOS Safari: iframe print often falls back to the full page — use native print + @media print CSS instead.
 */
export function useAppPrint({ contentRef, documentTitle }: UseAppPrintOptions) {
  const cleanupRef = useRef<(() => void) | null>(null);

  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle,
    preserveAfterPrint: true,
    pageStyle: PRINT_PAGE_STYLE,
  });

  return useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isIOS()) {
      cleanupRef.current?.();

      const printRoot =
        el.closest<HTMLElement>(".print-hidden-screen") ?? el;

      const previousTitle = document.title;
      document.title = documentTitle;
      printRoot.setAttribute("data-print-active", "true");
      document.body.classList.add("is-printing");

      let fallbackId: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        clearTimeout(fallbackId);
        document.body.classList.remove("is-printing");
        printRoot.removeAttribute("data-print-active");
        document.title = previousTitle;
        window.removeEventListener("afterprint", cleanup);
        cleanupRef.current = null;
      };

      fallbackId = setTimeout(cleanup, 5000);
      cleanupRef.current = cleanup;
      window.addEventListener("afterprint", cleanup);

      window.print();
      return;
    }

    reactToPrint();
  }, [contentRef, documentTitle, reactToPrint]);
}
