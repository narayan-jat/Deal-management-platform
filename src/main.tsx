
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import './index.css';
import { AuthProvider } from "./context/AuthProvider";
import { SearchProvider } from "./context/SearchProvider";
import { CreateDealProvider } from "./context/CreateDealProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <SearchProvider>
        <CreateDealProvider>
          <App />
        </CreateDealProvider>
      </SearchProvider>
    </AuthProvider>
  </React.StrictMode>
)
