export interface InitOptions {
  container: string | string[] | HTMLElement | HTMLElement[]
}

const containers: { [key: string]: MutationObserver } = {}

export function init({ container }: InitOptions): void {
  const containerElements = Array.isArray(container) ? container : [container]

  containerElements.forEach(container => {
    if (typeof container === 'string') {
      // For IDs (vanilla JS)
      const element = document.getElementById(container)
      if (element) {
        setupContainer(element)
      } else {
        console.warn(`Container with ID ${container} not found.`)
      }
    } else if (container instanceof HTMLElement) {
      // For direct HTML elements (e.g: React refs current)
      setupContainer(container)
    } else {
      console.warn('Provided container is neither a string nor an HTMLElement.')
    }
  })
}

function setupContainer(container: HTMLElement) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'signature') {
        const target = mutation.target as HTMLElement
        renderWidget(target)
      }
    })
  })

  renderWidget(container)
  observer.observe(container, { attributes: true })
  containers[container.id] = observer
}

function renderWidget(element: HTMLElement) {
  const signature = element.getAttribute('signature')
  if (!signature) {
    console.warn('No signature provided.')
    return
  }
  const subDomain = signature?.includes('transaction-failed') ? signature : `/invoice/widgets?hppEncodedId=${signature}`
  const iframe = document.createElement('iframe')
  iframe.src = `${process.env.BASE_URL}${subDomain}`
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation')
  iframe.setAttribute('referrerpolicy', 'no-referrer')
  element.innerHTML = ''
  element.appendChild(iframe)
}

export function cleanup(containerId: string) {
  const observer = containers[containerId]
  if (observer) {
    observer.disconnect()
    delete containers[containerId]
  }
}
