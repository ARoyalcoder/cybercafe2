import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./app/store";
import App from "./App";
import { ThemeProvider } from "./components/Providers/ThemeProvider";
import { Toaster } from "sonner";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>

        <Toaster
          richColors
          position="top-right"
          expand
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);