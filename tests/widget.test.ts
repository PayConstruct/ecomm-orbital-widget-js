import { describe, it, expect, beforeEach, afterEach, vi, type Mock, type MockInstance } from 'vitest'
import { init, cleanup } from '../src/widget'

describe('Widget Module', () => {
  let mockGetElementById: MockInstance
  let mockMutationObserver: Mock
  let mockWarn: MockInstance

  beforeEach(() => {
    mockGetElementById = vi.spyOn(document, 'getElementById')
    mockMutationObserver = vi.fn(function () {
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      }
    })
    ;(global as any).MutationObserver = mockMutationObserver
    mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  // init() renders through React's scheduler (setImmediate in Node). Drain that
  // work after each test so it never runs after jsdom has been torn down.
  afterEach(async () => {
    for (let i = 0; i < 10; i++) await new Promise(resolve => setTimeout(resolve, 0))
    vi.clearAllMocks()
  })

  describe('init function', () => {
    it('should initialize and observe valid container by ID', () => {
      const mockContainer = document.createElement('div')
      mockContainer.id = 'valid-container'
      mockContainer.getAttribute = vi.fn().mockReturnValue('valid-signature')
      mockGetElementById.mockReturnValue(mockContainer)

      init({ container: 'valid-container' })

      expect(mockGetElementById).toHaveBeenCalledWith('valid-container')
      expect(mockMutationObserver).toHaveBeenCalled()
      expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
    })

    it('should warn if container by ID is not found', () => {
      mockGetElementById.mockReturnValue(null)

      init({ container: 'missing-container' })

      expect(mockWarn).toHaveBeenCalledWith('Container with ID missing-container not found.')
    })

    it('should initialize multiple containers correctly', () => {
      const mockContainer1 = document.createElement('div')
      const mockContainer2 = document.createElement('div')
      mockContainer1.id = 'container-1'
      mockContainer2.id = 'container-2'
      mockContainer1.getAttribute = vi.fn().mockReturnValue('signature-1')
      mockContainer2.getAttribute = vi.fn().mockReturnValue('signature-2')

      mockGetElementById.mockImplementation(id => {
        if (id === 'container-1') return mockContainer1
        if (id === 'container-2') return mockContainer2
        return null
      })

      init({ container: ['container-1', 'container-2'] })

      expect(mockGetElementById).toHaveBeenCalledWith('container-1')
      expect(mockGetElementById).toHaveBeenCalledWith('container-2')
      expect(mockMutationObserver).toHaveBeenCalledTimes(2)
    })

    it('should handle HTMLElement container input', () => {
      const mockContainer = document.createElement('div')
      mockContainer.getAttribute = vi.fn().mockReturnValue('mock-signature')

      init({ container: mockContainer })

      expect(mockMutationObserver).toHaveBeenCalled()
      expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
    })

    it('should warn for invalid container input', () => {
      init({ container: 123 as any })

      expect(mockWarn).toHaveBeenCalledWith('Provided container is neither a string nor an HTMLElement.')
    })
  })

  describe('setupContainer and observer behavior', () => {
    it('should render and observe signature attribute changes', () => {
      const mockContainer = document.createElement('div')
      mockContainer.id = 'observed-container'
      mockContainer.getAttribute = vi.fn().mockReturnValue('observed-signature')

      const mockObserverInstance = {
        observe: vi.fn(),
        disconnect: vi.fn(),
      }

      mockMutationObserver.mockImplementation(function () {
        return mockObserverInstance
      })
      mockGetElementById.mockReturnValue(mockContainer)

      init({ container: 'observed-container' })

      expect(mockObserverInstance.observe).toHaveBeenCalledWith(mockContainer, {
        attributes: true,
      })

      const mockMutation = {
        type: 'attributes',
        attributeName: 'signature',
        target: mockContainer,
      }

      const observerCallback = mockMutationObserver.mock.calls[0][0]
      observerCallback([mockMutation])

      expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
    })

    it('should warn if no signature is provided', () => {
      const mockContainer = document.createElement('div')
      mockContainer.getAttribute = vi.fn().mockReturnValue(null)

      mockGetElementById.mockReturnValue(mockContainer)

      init({ container: 'container-without-signature' })

      expect(mockWarn).toHaveBeenCalledWith('No signature provided.')
    })
  })

  describe('cleanup function', () => {
    let mockContainer: HTMLElement
    let mockMutationObserver: Mock
    let mockObserverInstance: any

    beforeEach(() => {
      mockContainer = document.createElement('div')
      mockContainer.id = 'orbital-container'
      mockContainer.getAttribute = vi.fn().mockReturnValue('mock-signature')
      vi.spyOn(document, 'getElementById').mockReturnValue(mockContainer)

      mockObserverInstance = {
        observe: vi.fn(),
        disconnect: vi.fn(),
      }
      mockMutationObserver = vi.fn(function () {
        return mockObserverInstance
      })
      ;(global as any).MutationObserver = mockMutationObserver

      vi.resetModules()
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('should disconnect the observer and remove the container from the map after init', () => {
      init({ container: 'orbital-container' })

      expect(mockMutationObserver).toHaveBeenCalled()

      cleanup('orbital-container')

      expect(mockObserverInstance.disconnect).toHaveBeenCalled()
    })

    it('should do nothing if the container does not exist in the list', () => {
      cleanup('non-existent-container')

      expect(mockObserverInstance.disconnect).not.toHaveBeenCalled()
    })
  })
})
