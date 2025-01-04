import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import { HelmetProvider } from "react-helmet-async";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GGRb4RlVb",
  client_id: "6hg2ttnt7v00aflhj0qbgm0dgj",
  redirect_uri: window.location.origin + "/login/success",
  response_type: "code",
  scope: "phone openid email",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: window.location.origin + "/login/silent-renew",
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
