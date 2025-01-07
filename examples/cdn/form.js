document.getElementById('paymentForm').addEventListener('submit', async function (event) {
  event.preventDefault()

  const externalId = 'EPP' + new Date().toISOString()
  const payload = {
    externalId,
    returnUrl: `http://127.0.0.1:8081/success?externalId=${encodeURIComponent(externalId)}`,
    notifyUrl: 'http://notify.com',
    primaryColor: '#4097F6',
    secondaryColor: '#4097F6',
    nameType: 'legal',
    targetAmount: document.getElementById('targetAmount').value,
    targetCurrency: document.getElementById('targetCurrency').value,
    currency: document.getElementById('targetCurrency').value,
    email: document.getElementById('email').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    countryOfResidence: document.getElementById('countryOfResidence').value,
  }

  try {
    const response = await fetch(window.env.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': window.env.API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (data.signature) {
      window.location.href = `/payment?signature=${encodeURIComponent(data.signature)}`
    }
  } catch (error) {
    console.error('Error fetching signature:', error)
  }
})
