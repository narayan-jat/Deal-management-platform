
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import './index.css';
import { AuthProvider } from "./context/AuthProvider";
import { SearchProvider } from "./context/SearchProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
)
