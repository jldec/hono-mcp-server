export default function Home() {
  return (
    <div class="container">
      <h1>hono-mcp-server</h1>
      <p>This is a simple MCP server with a hello tool.</p>

      <h2>Endpoint:</h2>
      <ul>
        <li>
          <strong>MCP endpoint:</strong> <code>POST /mcp</code>
        </li>
      </ul>

      <h2>Test Examples:</h2>
      <p>
        <strong>Simple test:</strong> <a href="/test/hello">GET /test/hello</a>
      </p>
      <p>
        <strong>With name:</strong> <a href="/test/hello?name=Alice">GET /test/hello?name=Alice</a>
      </p>
    </div>
  )
}
