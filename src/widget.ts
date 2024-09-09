export interface InitOptions {
  container: string | string[]
}

const containers: { [key: string]: MutationObserver } = {}

export function init({ container }: InitOptions): void {
  const containerIds = Array.isArray(container) ? container : [container]

  containerIds.forEach(containerId => {
    const element = document.getElementById(containerId)
    if (element) {
      setupContainer(element)
    } else {
      console.warn(`Container with ID ${containerId} not found.`)
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

  const iframe = document.createElement('iframe')
  iframe.src = `${process.env.BASE_URL}/invoice/widgets?hppEncodedId=${signature}`
  iframe.setAttribute('sandbox', '')
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
