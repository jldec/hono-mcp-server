import { Hono } from 'hono'
import { renderer } from './renderer'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPTransport } from '@hono/mcp'
import { z } from 'zod'
import Home from './Home'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<Home />)
})

function generateHelloGreeting(name?: string): string {
  const greetName = name || 'world'

  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
    timeZoneName: 'short'
  })

  const formattedTime = formatter.format(now)
  return `hello ${greetName} ${formattedTime}`
}

// Create MCP server with hello tool
function createMcpServer() {
  const server = new McpServer({
    name: 'hello-world-mcp',
    version: '1.0.0',
    description: 'Simple hello world MCP server with timestamp'
  })

  // Hello tool that returns greeting with current timestamp
  server.tool(
    'hello',
    {
      name: z.string().optional().describe("Name to greet (defaults to 'world')")
    },
    async ({ name }) => {
      const greeting = generateHelloGreeting(name)

      return {
        content: [
          {
            type: 'text',
            text: greeting
          }
        ]
      }
    }
  )

  return server
}

// MCP endpoint - handles JSON-RPC requests over HTTP
app.all('/mcp', async (c) => {
  const mcpServer = createMcpServer()
  const transport = new StreamableHTTPTransport()

  await mcpServer.connect(transport)
  return transport.handleRequest(c)
})

export default app
