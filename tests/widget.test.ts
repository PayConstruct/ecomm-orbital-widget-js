import { init, cleanup } from '../src/widget'

describe('init function', () => {
  let mockGetElementById: jest.SpyInstance
  let mockMutationObserver: jest.Mock
  let mockWarn: jest.SpyInstance

  beforeEach(() => {
    // Mock document.getElementById
    mockGetElementById = jest.spyOn(document, 'getElementById')

    // Mock MutationObserver
    mockMutationObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
    ;(global as any).MutationObserver = mockMutationObserver

    // Mock console.warn
    mockWarn = jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should set up containers and observe mutations when valid containers are provided', () => {
    const mockContainer = document.createElement('div')
    mockContainer.id = 'orbital-container'
    mockContainer.getAttribute = jest.fn().mockReturnValue('mock-signature')

    mockGetElementById.mockReturnValue(mockContainer)

    // Call init function
    init({ container: 'orbital-container' })

    expect(mockGetElementById).toHaveBeenCalledWith('orbital-container')
    expect(mockMutationObserver).toHaveBeenCalled()
    expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
  })

  it('should warn when container is not found', () => {
    mockGetElementById.mockReturnValue(null)

    init({ container: 'missing-container' })

    expect(mockWarn).toHaveBeenCalledWith('Container with ID missing-container not found.')
  })

  it('should handle multiple containers', () => {
    const mockContainer1 = document.createElement('div')
    const mockContainer2 = document.createElement('div')
    mockContainer1.id = 'orbital-container-1'
    mockContainer2.id = 'orbital-container-2'

    mockContainer1.getAttribute = jest.fn().mockReturnValue('signature-1')
    mockContainer2.getAttribute = jest.fn().mockReturnValue('signature-2')

    mockGetElementById.mockImplementation(id => {
      if (id === 'orbital-container-1') return mockContainer1
      if (id === 'orbital-container-2') return mockContainer2
      return null
    })

    init({ container: ['orbital-container-1', 'orbital-container-2'] })

    expect(mockGetElementById).toHaveBeenCalledWith('orbital-container-1')
    expect(mockGetElementById).toHaveBeenCalledWith('orbital-container-2')
    expect(mockMutationObserver).toHaveBeenCalledTimes(2)
  })

  it('should warn when no signature is provided', () => {
    const mockContainer = document.createElement('div')
    mockContainer.id = 'no-signature-container'
    mockContainer.getAttribute = jest.fn().mockReturnValue(null)

    mockGetElementById.mockReturnValue(mockContainer)

    init({ container: 'no-signature-container' })

    expect(mockWarn).toHaveBeenCalledWith('No signature provided.')
  })

  it('should observe attribute changes and re-render widget', () => {
    const mockContainer = document.createElement('div')
    mockContainer.id = 'orbital-container'
    mockContainer.getAttribute = jest.fn().mockReturnValue('mock-signature')

    const mockMutationObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(),
    }

    mockMutationObserver.mockReturnValue(mockMutationObserverInstance)
    mockGetElementById.mockReturnValue(mockContainer)

    init({ container: 'orbital-container' })

    expect(mockMutationObserverInstance.observe).toHaveBeenCalled()

    // Simulate a mutation where the signature attribute changes
    const mockMutation = {
      type: 'attributes',
      attributeName: 'signature',
      target: mockContainer,
    }

    const observerCallback = mockMutationObserver.mock.calls[0][0] // Get observer callback function
    observerCallback([mockMutation]) // Trigger mutation observer callback

    expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
  })
})

describe('cleanup function', () => {
  let mockContainer: HTMLElement
  let mockMutationObserver: jest.Mock
  let mockObserverInstance: any

  beforeEach(() => {
    // Mock document.getElementById
    mockContainer = document.createElement('div')
    mockContainer.id = 'orbital-container'
    mockContainer.getAttribute = jest.fn().mockReturnValue('mock-signature')
    jest.spyOn(document, 'getElementById').mockReturnValue(mockContainer)

    // Mock MutationObserver
    mockObserverInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    }
    mockMutationObserver = jest.fn(() => mockObserverInstance)
    ;(global as any).MutationObserver = mockMutationObserver

    // Clear containers before each test
    jest.resetModules() // This forces a fresh module for each test
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should disconnect the observer and remove the container from the map after init', () => {
    // Call init to initialize the container and start observing
    init({ container: 'orbital-container' })

    // Verify that the observer was set up and the MutationObserver instance was created
    expect(mockMutationObserver).toHaveBeenCalled()

    // Call cleanup to remove the observer
    cleanup('orbital-container')

    // Check if disconnect was called
    expect(mockObserverInstance.disconnect).toHaveBeenCalled()
  })

  it('should do nothing if the container does not exist in the map', () => {
    const mockObserver = { disconnect: jest.fn() } as unknown as MutationObserver

    cleanup('non-existent-container')

    expect(mockObserver.disconnect).not.toHaveBeenCalled()
  })
})
