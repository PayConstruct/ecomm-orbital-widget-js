import './styles.css'

document.getElementById('paymentForm').addEventListener('submit', async function (event) {
  event.preventDefault()
  const externalId = 'EPP' + new Date().toISOString()
  // Collect form input values, hard coded things can be appended in the backend
  const payload = {
    externalId,
    returnUrl: `http://127.0.0.1:3000/success?externalId=${encodeURIComponent(externalId)}`,
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

    window.location.href = `payment?signature=${encodeURIComponent(data.signature)}`
  } catch (error) {
    console.error('Error fetching signature:', error)
  }
})
