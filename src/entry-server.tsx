// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="VectorDBBench UI" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">
            <div class="font-['Nunito'] dark:bg-gray-900 dark:text-white">
              {children}
            </div>
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
));
