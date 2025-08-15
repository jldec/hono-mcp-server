export default function Home() {
  return (
    <div class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-gray-800 pb-3">hono-mcp-server</h1>
      <p class="text-gray-600">Demo MCP server at <code class="bg-gray-100 px-1.5 py-0.5 rounded-md">POST /mcp</code></p>

      <h2 class="text-xl font-semibold text-gray-700 mt-8 mb-2">Test hello tool</h2>
      <div class="flex gap-3 items-center mb-4">
        <input
          type="text"
          id="nameInput"
          placeholder="Enter your name (optional)"
          class="flex-1 max-w-80 px-2 py-2 text-base border border-gray-300 rounded-md outline-none transition-colors duration-200 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(0,123,255,0.25)]"
        />
        <button id="helloToolBtn" class="px-4 py-2 text-base bg-green-600 text-white border-none rounded-md cursor-pointer transition-colors duration-200 hover:bg-green-700 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed">
          Call hello
        </button>
        <button id="fetchToolsBtn" class="px-4 py-2 text-base bg-blue-600 text-white border-none rounded-md cursor-pointer transition-opacity duration-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
          Fetch tools
        </button>
      </div>

      <div id="errorMessage" class="mt-4 p-2 bg-red-100 text-red-800 border border-red-200 rounded-md hidden">
        <strong class="text-gray-800">Error:</strong> <span id="errorText"></span>
      </div>

      <div id="helloResult" class="mt-4 hidden">
        <pre id="helloContent" class="bg-gray-50 p-4 rounded-md overflow-auto border border-gray-200"></pre>
      </div>

      <div id="toolsListResult" class="mt-4 hidden">
        <pre id="toolsListContent" class="bg-gray-50 p-4 rounded-md overflow-auto border border-gray-200"></pre>
      </div>
    </div>
  )
}
