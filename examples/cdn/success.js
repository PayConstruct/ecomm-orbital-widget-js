window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search)
  const externalId = urlParams.get('externalId')
  document.getElementById('transactionId').textContent = externalId || ''
})
