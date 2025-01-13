import React from 'react'
import { createRoot } from 'react-dom/client'
import { InitOptions } from './types'
import Button from './components/Button'
import Iframe from './components/Iframe'
import { IframeProvider } from './context/IframeContext'
const containers: { [key: string]: MutationObserver } = {}

export function init(options: InitOptions): void {
  const { container } = options
  const containerElements = Array.isArray(container) ? container : [container]

  containerElements.forEach(container => {
    if (typeof container === 'string') {
      // For IDs (vanilla JS)
      const element = document.getElementById(container)
      if (element) {
        setupContainer({ ...options, container: element })
      } else {
        console.warn(`Container with ID ${container} not found.`)
      }
    } else if (container instanceof HTMLElement) {
      // For direct HTML elements (e.g: React refs current)
      setupContainer({ ...options, container })
    } else {
      console.warn('Provided container is neither a string nor an HTMLElement.')
    }
  })
}

function setupContainer(options: InitOptions) {
  const { container } = options
  const containerElement = container as HTMLElement
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'signature') {
        const target = mutation.target as HTMLElement
        renderWidget({ ...options, container: target })
      }
    })
  })

  renderWidget({ ...options, container: containerElement })
  observer.observe(containerElement, { attributes: true })
  containers[containerElement.id] = observer
}

function renderWidget(options: InitOptions) {
  try {
    const { container, mode } = options
    const { button } = options
    const containerElement = container as HTMLElement
    const signature = containerElement.getAttribute('signature') || ''
    if (!signature) {
      console.warn('No signature provided.')
    }

    const root = createRoot(containerElement)
    if (mode === 'small-widgets' && button?.container) {
      let buttonContainer = button.container as HTMLElement
      if (typeof button.container === 'string') {
        buttonContainer = document.getElementById(button.container) as HTMLElement
      }

      const buttonRoot = createRoot(buttonContainer)
      buttonRoot.render(
        React.createElement(IframeProvider, {
          children: React.createElement(Button),
          initialOptions: options,
          signature,
        })
      )
    } else {
      root.render(
        React.createElement(IframeProvider, {
          children: React.createElement(Iframe),
          initialOptions: options,
          signature,
        })
      )
    }
  } catch (e) {
    console.error(e)
  }
}

export function cleanup(containerId: string) {
  const observer = containers[containerId]
  if (observer) {
    observer.disconnect()
    delete containers[containerId]
  }
}
