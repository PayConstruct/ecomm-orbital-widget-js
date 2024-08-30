window.addEventListener('load', () => {
  setTimeout(() => {
    const firstElementEntry = document.getElementById('orbital')
    if (firstElementEntry) {
      firstElementEntry.setAttribute('signature', '1262be59-87d3-49e6-a88a-5431a4321c89')
    }
  }, 5000)

  if (typeof OrbitalWidget !== 'undefined' && typeof OrbitalWidget.init === 'function') {
    OrbitalWidget.init({
      container: 'orbital',
      url: 'https://hpp.tst.getorbital.io/invoice/widgets',
    })
  } else {
    console.error('OrbitalWidget was not loaded properly.')
  }
})

//WIP, CORS issue
// window.addEventListener('load', async () => {
//   await fetch('https://hpp.tst.getorbital.io/invoice/widgets', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-api-key': '', //add your own API key
//       'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
//       'Access-Control-Allow-Credentials': true,
//     },
//     body: JSON.stringify({
//       targetAmount: '22',
//       targetCurrency: 'TST',
//       currency: 'TST',
//       returnUrl: 'https://www.getorbital.com/',
//       notifyUrl: 'http://notify.com',
//       primaryColor: '#4097F6',
//       secondaryColor: '#4097F6',
//       format: 'json',
//       email: 'neilzon.calosa@getorbital.com',
//       externalId: 'HPP-WEB3-' + new Date().toISOString(),
//       firstName: 'Neilzon',
//       lastName: 'Calosa',
//       countryOfResidence: 'US',
//       nameType: 'legal',
//       productImage:
//         'https://st2.depositphotos.com/2021995/9294/i/450/depositphotos_92947036-stock-photo-jpeg-concept-wooden-letterpress-type.jpg',
//     }),
//   })
//     .then(response => response.json())
//     .then(data => {
//       const orbitalElement = document.getElementsByTagName('orbital')
//       if (orbitalElement && data.signature) {
//         orbitalElement.setAttribute('signature', data.signature)
//       }

//       if (typeof OrbitalWidget !== 'undefined' && typeof OrbitalWidget.init === 'function') {
//         OrbitalWidget.init({
//           container: 'orbital',
//         })
//       } else {
//         console.error('OrbitalWidget was not loaded properly.')
//       }
//     })
//     .catch(error => console.error('Error fetching signature:', error))
// })
