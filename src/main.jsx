import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { FormProvider } from "./Company/context/FormContext";

createRoot(document.getElementById("root")).render(
  <FormProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </FormProvider>,
);
