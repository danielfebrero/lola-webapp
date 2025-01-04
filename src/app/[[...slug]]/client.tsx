"use client";

import dynamic from "next/dynamic";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GGRb4RlVb",
  client_id: "6hg2ttnt7v00aflhj0qbgm0dgj",
  redirect_uri: window.location.origin + "/login/success",
  response_type: "code",
  scope: "phone openid email",
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: window.location.origin + "/login/silent-renew",
  userStore: undefined,
};

if (typeof window !== "undefined") {
  cognitoAuthConfig.userStore = new WebStorageStateStore({
    store: window.localStorage,
  }) as unknown as undefined;
}

const App = dynamic(() => import("../../App"), { ssr: false });

export function ClientOnly() {
  return (
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  );
}
