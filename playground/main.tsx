import ReactDOM from "react-dom/client";
import "./index.css"; // ← lib's Tailwind styles
import NepaliDatePicker from "@lib";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <div className="p-10">
    <NepaliDatePicker />
  </div>,
);
