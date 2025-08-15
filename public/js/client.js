document.addEventListener('DOMContentLoaded', function () {
  const fetchToolsBtn = document.getElementById('fetchToolsBtn')
  const helloToolBtn = document.getElementById('helloToolBtn')
  const nameInput = document.getElementById('nameInput')

  const errorContent = document.getElementById('errorMessage')
  const helloContent = document.getElementById('helloContent')
  const toolsListContent = document.getElementById('toolsListContent')

  if (
    !fetchToolsBtn ||
    !helloToolBtn ||
    !nameInput ||
    !errorContent ||
    !helloContent ||
    !toolsListContent
  ) {
    console.error('One or more elements not found in the DOM - see client.js')
    return
  }

  fetchToolsBtn.addEventListener('click', async function () {
    await fetchMcpRequest(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list'
      },
      toolsListContent
    )
  })

  helloToolBtn.addEventListener('click', async function () {
    const name = nameInput.value.trim()
    const params = name ? { name } : {}
    await fetchMcpRequest(
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'hello',
          arguments: params
        }
      },
      helloContent
    )
  })

  async function fetchMcpRequest(rpcPayload, resultElement) {
    try {
      const response = await fetch('/mcp', {
        method: 'POST',
        headers: {
          accept: 'application/json, text/event-stream',
          'content-type': 'application/json'
        },
        body: JSON.stringify(rpcPayload)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await handleMcpResponse(response, resultElement)
    } catch (err) {
      error(err)
    }
  }

  function error(err) {
    errorContent.textContent = err instanceof Error ? err.stack || err.message : 'An error occurred'
    errorContent.classList.remove('hidden')
  }

  async function handleMcpResponse(response, resultElement) {
    const contentType = response.headers.get('content-type')
    resultElement.classList.remove('hidden')

    if (contentType && contentType.includes('text/event-stream')) {
      // Handle Server-Sent Events
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let eventData = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          eventData += chunk
        }

        // Parse the accumulated event stream data
        const events = eventData.split('\n\n').filter((event) => event.trim())
        const parsedEvents = events.map((event) => {
          const lines = event.split('\n')
          const eventObj = {}
          lines.forEach((line) => {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                Object.assign(eventObj, data)
              } catch (e) {
                // If not JSON, store as raw data
                eventObj.rawData = line.slice(6)
              }
            } else if (line.startsWith('event: ')) {
              eventObj.eventType = line.slice(7)
            } else if (line.startsWith('id: ')) {
              eventObj.id = line.slice(4)
            }
          })
          return eventObj
        })

        resultElement.textContent = JSON.stringify(parsedEvents, null, 2)
      } catch (streamErr) {
        // If stream reading fails, try to show raw response
        const rawText = await response.text()
        resultElement.textContent = rawText
      }
    } else {
      // Handle regular JSON response
      const data = await response.json()
      resultElement.textContent = JSON.stringify(data, null, 2)
    }
  }
})
