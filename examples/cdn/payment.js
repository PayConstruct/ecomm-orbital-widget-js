window.addEventListener('load', () => {
  const smallWidgetsTab = document.getElementById('small-widgets-tab')
  const iframeOnlyTab = document.getElementById('iframe-only-tab')
  const smallWidgetsContent = document.getElementById('small-widgets-content')
  const iframeOnlyContent = document.getElementById('iframe-only-content')
  const alertElement = document.getElementById('alert')
  const orbitalElement = document.getElementById('orbital')
  const orbitalElementIframe = document.getElementById('orbital-iframe')
  const orbitalButtonContainer = document.getElementById('orbital-button-container')
  const paymentPlaceholder = document.getElementById('payment-placeholder')

  const urlParams = new URLSearchParams(window.location.search)
  const signature = urlParams.get('signature')

  let selectedTab = 'small-widgets'

  function clearWidget() {
    orbitalElement.innerHTML = ''
    orbitalElementIframe.innerHTML = ''
  }

  function switchTab(tab) {
    clearWidget()
    let container = orbitalElement

    if (tab === 'small-widgets') {
      container = orbitalElement

      // Show smallWidgetsContent and hide iframeOnlyContent
      smallWidgetsContent.style.display = 'block'
      iframeOnlyContent.style.display = 'none'

      // Apply styles to the tabs
      smallWidgetsTab.style.borderColor = '#3B82F6'
      smallWidgetsTab.style.color = '#3B82F6'

      iframeOnlyTab.style.borderColor = 'transparent'
      iframeOnlyTab.style.color = 'inherit'
    } else {
      container = orbitalElementIframe

      // Hide smallWidgetsContent and show iframeOnlyContent
      smallWidgetsContent.style.display = 'none'
      iframeOnlyContent.style.display = 'block'

      // Apply styles to the tabs
      iframeOnlyTab.style.borderColor = '#3B82F6'
      iframeOnlyTab.style.borderBottomWidth = '4px'
      iframeOnlyTab.style.color = '#3B82F6'

      smallWidgetsTab.style.borderColor = 'transparent'
      smallWidgetsTab.style.color = 'inherit'
    }

    selectedTab = tab
    reInitializePackage(tab, container)
  }

  function reInitializePackage(tab, container) {
    if (signature) {
      alertElement.classList.add('hidden')
      container.setAttribute('signature', signature)
      if (typeof OrbitalWidget !== 'undefined' && typeof OrbitalWidget.init === 'function') {
        OrbitalWidget.init({
          container: container,
          mode: tab,
          button: {
            color: 'blue-white',
            logoOnly: true,
            container: orbitalButtonContainer,
            onClickCallback: () => {
              paymentPlaceholder.classList.add('hidden')
              container.classList.remove('hidden')
            },
          },
        })
      } else {
        console.error('OrbitalWidget was not loaded properly.')
      }
    } else {
      alertElement.classList.remove('hidden')
    }
  }

  smallWidgetsTab.addEventListener('click', () => switchTab('small-widgets'))
  iframeOnlyTab.addEventListener('click', () => switchTab('iframe-only'))

  document.getElementById('apple-pay-button').addEventListener('click', () => {
    paymentPlaceholder.textContent = 'Apple Pay selected.'
  })

  document.getElementById('google-pay-button').addEventListener('click', () => {
    paymentPlaceholder.textContent = 'Google Pay selected.'
  })

  reInitializePackage(selectedTab, orbitalElement)
})
