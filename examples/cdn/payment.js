window.addEventListener('load', event => {
  const urlParams = new URLSearchParams(window.location.search)
  const signature = urlParams.get('signature')

  if (signature) {
    const orbitalElement = document.getElementById('orbital')
    orbitalElement.setAttribute('signature', signature)

    if (typeof OrbitalWidget !== 'undefined' && typeof OrbitalWidget.init === 'function') {
      OrbitalWidget.init({
        container: 'orbital',
      })
    } else {
      console.error('OrbitalWidget was not loaded properly.')
    }
  } else {
    const alertElement = document.getElementById('alert')
    alertElement.classList.remove('hidden')
  }
})
