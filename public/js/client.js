document.addEventListener('DOMContentLoaded', function () {
  // Utility function to handle MCP responses (both JSON and event-stream)
  // Fetch Tools List functionality
  const fetchToolsBtn = document.getElementById('fetchToolsBtn')

  if (fetchToolsBtn) {
    fetchToolsBtn.addEventListener('click', async function () {
      const button = this
      const errorDiv = document.getElementById('errorMessage')
      const resultDiv = document.getElementById('toolsListResult')
      const errorText = document.getElementById('errorText')

      // Reset UI
      errorDiv.style.display = 'none'
      resultDiv.style.display = 'none'
      setButtonLoading(button)

      try {
        const response = await fetch('/mcp', {
          method: 'POST',
          headers: {
            accept: 'application/json, text/event-stream',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list'
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        await handleMcpResponse(response, document.getElementById('toolsListContent'), resultDiv)
      } catch (err) {
        errorText.textContent = err instanceof Error ? err.message : 'An error occurred'
        errorDiv.style.display = 'block'
      } finally {
        resetButton(button)
      }
    })
  } else {
    console.warn('Fetch tools button not found in the DOM')
  }

  // Hello Tool functionality
  const helloToolBtn = document.getElementById('helloToolBtn')

  if (helloToolBtn) {
    helloToolBtn.addEventListener('click', async function () {
      const button = this
      const nameInput = document.getElementById('nameInput')
      const helloError = document.getElementById('helloError')
      const helloResult = document.getElementById('helloResult')
      const helloErrorText = document.getElementById('helloErrorText')
      const helloContent = document.getElementById('helloContent')

      // Reset UI
      helloError.style.display = 'none'
      helloResult.style.display = 'none'
      setButtonLoading(button)

      try {
        const name = nameInput.value.trim()
        const params = name ? { name } : {}

        const response = await fetch('/mcp', {
          method: 'POST',
          headers: {
            accept: 'application/json, text/event-stream',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'hello',
              arguments: params
            }
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        await handleMcpResponse(response, helloContent, helloResult)
      } catch (err) {
        helloErrorText.textContent = err instanceof Error ? err.message : 'An error occurred'
        helloError.style.display = 'block'
      } finally {
        resetButton(button)
      }
    })
  } else {
    console.warn('Hello tool button not found in the DOM')
  }

  async function handleMcpResponse(response, resultElement, resultDiv) {
    const contentType = response.headers.get('content-type')

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
        resultDiv.style.display = 'block'
      } catch (streamErr) {
        // If stream reading fails, try to show raw response
        const rawText = await response.text()
        resultElement.textContent = rawText
        resultDiv.style.display = 'block'
      }
    } else {
      // Handle regular JSON response
      const data = await response.json()
      resultElement.textContent = JSON.stringify(data, null, 2)
      resultDiv.style.display = 'block'
    }
  }

  // Utility function to reset button state
  function resetButton(button) {
    button.disabled = false
    button.style.opacity = '1'
    button.style.cursor = 'pointer'
  }

  // Utility function to set button loading state
  function setButtonLoading(button) {
    button.disabled = true
    button.style.opacity = '0.6'
    button.style.cursor = 'not-allowed'
  }
})
