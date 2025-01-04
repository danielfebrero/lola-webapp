import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./src/App";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use(express.static(path.resolve(__dirname, "build")));

// SSR route
app.get("*", (req, res) => {
  const appHTML = ReactDOMServer.renderToString(React.createElement(App));
  const indexHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React SSR</title>
        </head>
        <body>
            <div id="root">${appHTML}</div>
            <script src="/static/js/bundle.js"></script>
        </body>
        </html>
    `;
  res.send(indexHTML);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
