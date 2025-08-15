export default function Home() {
  return (
    <div class="max-w-6xl mx-auto bg-white p-10 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 border-b-3 border-blue-500 pb-3">hono-mcp-server</h1>
      <p class="text-gray-600">This is a simple MCP server at /mcp with a hello tool.</p>

      <h2 class="text-2xl font-semibold text-gray-700 mt-8">Hello Tool:</h2>
      <div class="flex gap-3 items-center mb-4">
        <input
          type="text"
          id="nameInput"
          placeholder="Enter your name (optional)"
          class="flex-1 max-w-80 px-3 py-2.5 text-base border border-gray-300 rounded-md outline-none transition-colors duration-200 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(0,123,255,0.25)]"
        />
        <button id="helloToolBtn" class="px-5 py-2.5 text-base bg-green-600 text-white border-none rounded-md cursor-pointer transition-colors duration-200 hover:bg-green-700 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed">
          Call Hello
        </button>
        <button id="fetchToolsBtn" class="px-5 py-2.5 text-base bg-blue-600 text-white border-none rounded-md cursor-pointer transition-opacity duration-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
          Fetch Tools
        </button>
      </div>

      <div id="errorMessage" class="mt-5 p-2.5 bg-red-100 text-red-800 border border-red-200 rounded-md hidden">
        <strong class="text-gray-800">Error:</strong> <span id="errorText"></span>
      </div>

      <div id="helloResult" class="mt-5 hidden">
        <pre id="helloContent" class="bg-gray-50 p-4 rounded-md overflow-auto border border-gray-200"></pre>
      </div>

      <div id="toolsListResult" class="mt-5 hidden">
        <pre id="toolsListContent" class="bg-gray-50 p-4 rounded-md overflow-auto border border-gray-200"></pre>
      </div>
    </div>
  )
}
