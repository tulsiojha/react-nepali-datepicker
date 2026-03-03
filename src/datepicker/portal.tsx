import type { ComponentPropsWithRef } from "react";
import { createPortal } from "react-dom";

export function Portal(props: ComponentPropsWithRef<"div">) {
  const el = document.querySelector("body")!;
  return createPortal(<div ref={props.ref} {...props} />, el);
}
