window.addEventListener('load', async () => {
  /**
   * Payload of the request against the API
   * reference: https://api-docs.getorbital.com/#4a1bf8f1-d8c9-488b-83fb-ec8a0553ace1
   */
  const payload = {
    targetAmount: '23',
    targetCurrency: 'TST',
    currency: 'TST',
    returnUrl: 'https://www.getorbital.com/',
    notifyUrl: 'http://notify.com',
    primaryColor: '#4097F6',
    secondaryColor: '#4097F6',
    format: 'json',
    email: 'neilzon.calosa@getorbital.com',
    externalId: 'HPP-WEB3-' + new Date().toISOString(),
    firstName: 'Neilzon',
    lastName: 'Calosa',
    countryOfResidence: 'US',
    nameType: 'legal',
  }

  await fetch(window.env.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': window.env.API_KEY,
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
})
