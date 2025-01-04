import { jsx as _jsx } from "react/jsx-runtime";
import express from "express";
import path from "path";
import ReactDOMServer from "react-dom/server";
import { fileURLToPath } from "url";
import App from "./src/App";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.static(path.resolve(__dirname, "build")));
app.get("*", (req, res) => {
    const appHTML = ReactDOMServer.renderToString(_jsx(App, {}));
    res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>React SSR</title></head>
      <body>
        <div id="root">${appHTML}</div>
        <script src="/static/js/bundle.js"></script>
      </body>
    </html>
  `);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
