import * as OrbitalWidget from '@payperform/widget'
import './styles.css'

document.getElementById('paymentForm').addEventListener('submit', async function (event) {
  event.preventDefault()
  const orbitalElement = document.getElementById('orbital')
  // Collect form input values, hard coded things can be appended in the backend
  const payload = {
    externalId: 'HPP-WEB3-' + new Date().toISOString(),
    returnUrl: 'https://www.getorbital.com/',
    notifyUrl: 'http://notify.com',
    primaryColor: '#4097F6',
    secondaryColor: '#4097F6',
    nameType: 'legal',
    targetAmount: document.getElementById('targetAmount').value,
    targetCurrency: document.getElementById('targetCurrency').value,
    currency: document.getElementById('currency').value,
    email: document.getElementById('email').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    countryOfResidence: document.getElementById('countryOfResidence').value,
    locale: document.getElementById('locale').value,
  }

  // Hide the form and show the iframe container
  document.getElementById('formContainer').classList.add('hidden')
  orbitalElement.classList.remove('hidden')
  orbitalElement.classList.add('iframe-container')

  // Fetch the signature and initialize the widget
  try {
    const response = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (data.signature) {
      orbitalElement.setAttribute('signature', data.signature)

      if (typeof OrbitalWidget !== 'undefined' && typeof OrbitalWidget.init === 'function') {
        OrbitalWidget.init({
          container: 'orbital',
        })
      } else {
        console.error('OrbitalWidget was not loaded properly.')
      }
    }
  } catch (error) {
    console.error('Error fetching signature:', error)
  }
})
