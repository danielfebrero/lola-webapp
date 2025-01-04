import "../index.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return;
  <html lang="en">
    <head>
      <meta name="theme-color" content="#000000" />
      <meta
        name="description"
        content="Lola - Storyteller and you are the hero"
      />
      <title>Lola</title>
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root"></div>
    </body>
  </html>;
}
