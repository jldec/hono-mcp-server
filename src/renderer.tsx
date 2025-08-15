import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
        <script src="/js/fetchtools.js"></script>
        <title>Hello World MCP Server</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
