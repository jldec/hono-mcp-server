document.addEventListener('DOMContentLoaded', function () {
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
      button.disabled = true
      button.textContent = 'Fetching...'
      button.style.opacity = '0.6'
      button.style.cursor = 'not-allowed'

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

            document.getElementById('toolsListContent').textContent = JSON.stringify(
              parsedEvents,
              null,
              2
            )
            resultDiv.style.display = 'block'
          } catch (streamErr) {
            // If stream reading fails, try to show raw response
            const rawText = await response.text()
            document.getElementById('toolsListContent').textContent = rawText
            resultDiv.style.display = 'block'
          }
        } else {
          // Handle regular JSON response
          const data = await response.json()
          document.getElementById('toolsListContent').textContent = JSON.stringify(data, null, 2)
          resultDiv.style.display = 'block'
        }
      } catch (err) {
        errorText.textContent = err instanceof Error ? err.message : 'An error occurred'
        errorDiv.style.display = 'block'
      } finally {
        button.disabled = false
        button.textContent = 'Fetch Tools List'
        button.style.opacity = '1'
        button.style.cursor = 'pointer'
      }
    })
  } else {
    console.warn('Fetch tools button not found in the DOM')
  }
})
