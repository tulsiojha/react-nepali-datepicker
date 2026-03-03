import { useLayoutEffect, useRef, useState, type RefObject } from "react";

export type Placement = "top" | "bottom";
export type Align = "start" | "center" | "end";

export type FloatingBounds = {
  top: number;
  left: number;
  placement: Placement;
  align: Align;
};

export type AlignmentOptions = {
  placement?: Placement;
  align?: Align;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  padding?: number;
};

function useFloatingAdvanced(
  referenceRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  deps: any[] = [],
  options: AlignmentOptions = {},
) {
  const {
    placement = "bottom",
    align = "start",
    offset = 8,
    flip = true,
    shift = true,
    padding = 8,
  } = options;

  const [bounds, setBounds] = useState<FloatingBounds>({
    top: 0,
    left: 0,
    placement,
    align,
  });

  const frameRef = useRef<number>(0);

  const calculate = () => {
    const reference = referenceRef.current;
    const floating = floatingRef.current;
    if (!reference || !floating) return;

    const refRect = reference.getBoundingClientRect();
    const floatRect = floating.getBoundingClientRect();

    const spaceAbove = refRect.top;
    const spaceBelow = window.innerHeight - refRect.bottom;

    let finalPlacement = placement;

    // Flip logic
    if (flip) {
      if (
        placement === "bottom" &&
        spaceBelow < floatRect.height &&
        spaceAbove > spaceBelow
      ) {
        finalPlacement = "top";
      } else if (
        placement === "top" &&
        spaceAbove < floatRect.height &&
        spaceBelow > spaceAbove
      ) {
        finalPlacement = "bottom";
      }
    }

    // Vertical positioning
    let top =
      finalPlacement === "bottom"
        ? refRect.bottom + offset
        : refRect.top - floatRect.height - offset;

    // Horizontal alignment
    let left = 0;

    switch (align) {
      case "start":
        left = refRect.left;
        break;

      case "center":
        left = refRect.left + refRect.width / 2 - floatRect.width / 2;
        break;

      case "end":
        left = refRect.right - floatRect.width;
        break;
    }

    // Shift inside viewport
    if (shift) {
      if (left < padding) left = padding;
      if (left + floatRect.width > window.innerWidth - padding) {
        left = window.innerWidth - floatRect.width - padding;
      }

      if (top < padding) top = padding;
      if (top + floatRect.height > window.innerHeight - padding) {
        top = window.innerHeight - floatRect.height - padding;
      }
    }

    setBounds({
      top: top + window.pageYOffset,
      left: left + window.pageXOffset,
      placement: finalPlacement,
      align,
    });
  };

  // Core observers
  useLayoutEffect(() => {
    if (!isOpen) return;

    calculate();

    const observer = new ResizeObserver(calculate);

    if (referenceRef.current) observer.observe(referenceRef.current);
    if (floatingRef.current) observer.observe(floatingRef.current);

    window.addEventListener("resize", calculate);
    window.addEventListener("scroll", calculate, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculate);
      window.removeEventListener("scroll", calculate, true);
    };
  }, [isOpen, placement, align, offset, flip, shift, padding, ...deps]);

  // rAF loop for animation safety
  useLayoutEffect(() => {
    if (!isOpen) return;

    const loop = () => {
      calculate();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isOpen]);

  return { bounds, update: calculate };
}

export default useFloatingAdvanced;
