import React from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

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

const container = document.getElementById("root");

hydrateRoot(
  container as unknown as Document,
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
