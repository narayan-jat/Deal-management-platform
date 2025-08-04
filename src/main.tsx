
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import './index.css';
import { AuthProvider } from "./context/AuthProvider";
import { SearchProvider } from "./context/SearchProvider";
import { CreateDealProvider } from "./context/CreateDealProvider";
import { UserProfileProvider } from "./context/UserProfileProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProfileProvider>
        <SearchProvider>
          <CreateDealProvider>
            <App />
          </CreateDealProvider>
        </SearchProvider>
      </UserProfileProvider>
    </AuthProvider>
  </React.StrictMode>
)
