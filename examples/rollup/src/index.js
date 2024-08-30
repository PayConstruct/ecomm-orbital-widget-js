import * as OrbitalWidget from '@payconstruct/orbital-widget'
import { payload } from '../config'
;(async () => {
  await fetch(process.env.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
    body: JSON.stringify(payload),
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
})()
