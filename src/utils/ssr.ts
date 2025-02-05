import { GetServerSidePropsContext } from "next";

export const getAPIUrlFromContext = (context: GetServerSidePropsContext) => {
  const host = context.req.headers.host || "";
  const isDevDomain = host === "dev.fabularius.ai" || host === "localhost:3000";

  return isDevDomain
    ? `https://devapi.fabularius.ai/dev`
    : `https://prodapi.fabularius.ai/prod`;
};
