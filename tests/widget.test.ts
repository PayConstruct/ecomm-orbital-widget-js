import { init, cleanup } from '../src/widget'

describe('init function', () => {
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

  it('should set up containers and observe mutations when valid containers are provided', () => {
    const mockContainer = document.createElement('div')
    mockContainer.id = 'orbital-container'
    mockContainer.getAttribute = jest.fn().mockReturnValue('mock-signature')

    mockGetElementById.mockReturnValue(mockContainer)

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

    const mockMutation = {
      type: 'attributes',
      attributeName: 'signature',
      target: mockContainer,
    }

    const observerCallback = mockMutationObserver.mock.calls[0][0] // Get observer callback function
    observerCallback([mockMutation]) // Trigger mutation observer callback

    expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
  })

  it('should handle React containers (HTMLElement)', () => {
    const mockContainer = document.createElement('div')
    mockContainer.id = 'react-container'
    mockContainer.getAttribute = jest.fn().mockReturnValue('mock-signature')

    init({ container: mockContainer })

    expect(mockMutationObserver).toHaveBeenCalled()
    expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
  })

  it('should warn when container is neither a string nor an HTMLElement', () => {
    // @ts-ignore
    init({ container: 123 })

    expect(mockWarn).toHaveBeenCalledWith('Provided container is neither a string nor an HTMLElement.')
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
