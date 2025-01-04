import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../src/App";

export default async function handler(req: any, res: any): Promise<void> {
  const appHTML = ReactDOMServer.renderToString(<App />);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lola SSR</title>
    </head>
    <body>
      <div id="root">${appHTML}</div>
      <script src="/static/js/bundle.js"></script>
    </body>
    </html>
  `;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
