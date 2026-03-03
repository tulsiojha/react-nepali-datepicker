import ReactDOM from "react-dom/client";
import "./index.css"; // ← lib's Tailwind styles
import NepaliDatePicker from "@lib";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedWrapper = ({ children }: { children?: ReactNode }) => (
  <AnimatePresence>{children}</AnimatePresence>
);

const AnimatedComponent = ({ children }: { children?: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.div>
);

ReactDOM.createRoot(document.getElementById("app")!).render(
  <div className="p-10">
    <NepaliDatePicker
      placeholder="Select date"
      open
      components={{
        portalContainer({ portal }) {
          return <AnimatedWrapper>{portal}</AnimatedWrapper>;
        },
        menuContainer({ menu }) {
          return <AnimatedComponent>{menu}</AnimatedComponent>;
        },
      }}
    />
  </div>,
);
