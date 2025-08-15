export default function Home() {
  return (
    <div class="container">
      <h1>hono-mcp-server</h1>
      <p>This is a simple MCP server at /mcp with a hello tool.</p>

      <h2>Hello Tool:</h2>
      <div class="hello-tool-container">
        <input
          type="text"
          id="nameInput"
          placeholder="Enter your name (optional)"
          class="name-input"
        />
        <button id="helloToolBtn" class="hello-button">
          Call Hello
        </button>
        <button id="fetchToolsBtn" class="fetch-button">
          Fetch Tools
        </button>
      </div>

      <div id="helloError" class="error-message">
        <strong>Error:</strong> <span id="helloErrorText"></span>
      </div>

      <div id="helloResult" class="hello-result">
        <pre id="helloContent" class="hello-content"></pre>
      </div>

      <div id="errorMessage" class="error-message">
        <strong>Error:</strong> <span id="errorText"></span>
      </div>

      <div id="toolsListResult" class="tools-result">
        <pre id="toolsListContent" class="tools-content"></pre>
      </div>
    </div>
  )
}
