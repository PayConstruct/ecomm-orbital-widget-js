import { init, cleanup } from '../src/widget'

describe('Widget Module', () => {
  let mockGetElementById: jest.SpyInstance
  let mockMutationObserver: jest.Mock
  let mockWarn: jest.SpyInstance

  beforeEach(() => {
    mockGetElementById = jest.spyOn(document, 'getElementById')
    mockMutationObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
    ;(global as any).MutationObserver = mockMutationObserver
    mockWarn = jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('init function', () => {
    it('should initialize and observe valid container by ID', () => {
      const mockContainer = document.createElement('div')
      mockContainer.id = 'valid-container'
      mockContainer.getAttribute = jest.fn().mockReturnValue('valid-signature')
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
      mockContainer1.getAttribute = jest.fn().mockReturnValue('signature-1')
      mockContainer2.getAttribute = jest.fn().mockReturnValue('signature-2')

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
      mockContainer.getAttribute = jest.fn().mockReturnValue('mock-signature')

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
      mockContainer.getAttribute = jest.fn().mockReturnValue('observed-signature')

      const mockObserverInstance = {
        observe: jest.fn(),
        disconnect: jest.fn(),
      }

      mockMutationObserver.mockReturnValue(mockObserverInstance)
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
      mockContainer.getAttribute = jest.fn().mockReturnValue(null)

      mockGetElementById.mockReturnValue(mockContainer)

      init({ container: 'container-without-signature' })

      expect(mockWarn).toHaveBeenCalledWith('No signature provided.')
    })
  })

  describe('cleanup function', () => {
    let mockContainer: HTMLElement
    let mockMutationObserver: jest.Mock
    let mockObserverInstance: any

    beforeEach(() => {
      mockContainer = document.createElement('div')
      mockContainer.id = 'orbital-container'
      mockContainer.getAttribute = jest.fn().mockReturnValue('mock-signature')
      jest.spyOn(document, 'getElementById').mockReturnValue(mockContainer)

      mockObserverInstance = {
        observe: jest.fn(),
        disconnect: jest.fn(),
      }
      mockMutationObserver = jest.fn(() => mockObserverInstance)
      ;(global as any).MutationObserver = mockMutationObserver

      jest.resetModules()
    })

    afterEach(() => {
      jest.clearAllMocks()
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
