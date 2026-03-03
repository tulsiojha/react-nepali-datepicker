import { useLayoutEffect, useState, type RefObject } from "react";

export function useAutoPopupPosition({
  triggerRef,
  popupRef,
  open,
  offset = 6,
}: {
  triggerRef: RefObject<HTMLDivElement | null>;
  popupRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  offset: number;
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const calculate = () => {
    if (!triggerRef.current || !popupRef.current) return;

    const t = triggerRef.current.getBoundingClientRect();
    const p = popupRef.current.getBoundingClientRect();

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = t.bottom + offset;
    let left = t.left;

    // ---- Horizontal Boundary Adjustments ----
    if (left + p.width > vw) {
      left = vw - p.width - offset; // shift left
    }
    if (left < 0) {
      left = offset;
    }

    // ---- Vertical Boundary Flipping ----
    if (top + p.height > vh) {
      // flip up
      const upTop = t.top - p.height - offset;
      if (upTop > 0) {
        top = upTop;
      } else {
        // clamp to bottom
        top = vh - p.height - offset;
      }
    }

    // final safety clamp
    top = Math.max(offset, Math.min(top, vh - p.height - offset));

    setPos({ top, left });
  };

  // Recalculate whenever open changes
  useLayoutEffect(() => {
    if (!open) return;
    calculate();

    // Recalculate on resize or scroll
    window.addEventListener("resize", calculate);
    window.addEventListener("scroll", calculate, true);

    return () => {
      window.removeEventListener("resize", calculate);
      window.removeEventListener("scroll", calculate, true);
    };
  }, [open]);

  return pos;
}
