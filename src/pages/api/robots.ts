import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the host from headers
  const host = req.headers.host || "";

  let robotsTxt = "";

  if (host.includes("dev.fabularius.ai") || host.includes("localhost")) {
    // Disallow everything on the dev domain
    robotsTxt = `User-agent: *\nDisallow: /`;
  } else {
    // Allow everything on the main domain
    robotsTxt = `User-agent: *\nAllow: /`;
  }

  res.setHeader("Content-Type", "text/plain");
  res.send(robotsTxt.trim());
}
