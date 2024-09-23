window.addEventListener('load', async () => {
  await fetch(window.env.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': window.env.API_KEY,
    },
    body: JSON.stringify(window.env.PAYLOAD),
  })
    .then(response => response.json())
    .then(data => {
      const orbitalElement = document.getElementById('orbital')
      if (orbitalElement && data.signature) {
        orbitalElement.setAttribute('signature', data.signature)
      }

      if (typeof OrbitalWidget !== 'undefined' && typeof OrbitalWidget.init === 'function') {
        OrbitalWidget.init({
          container: 'orbital',
        })
      } else {
        console.error('OrbitalWidget was not loaded properly.')
      }
    })
    .catch(error => console.error('Error fetching signature:', error))
})
