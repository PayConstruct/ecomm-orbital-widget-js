import { init, cleanup } from '../src/widget'

describe('init function', () => {
  let mockGetElementById: jest.SpyInstance
  let mockMutationObserver: jest.Mock

  beforeEach(() => {
    // Mock document.getElementById
    mockGetElementById = jest.spyOn(document, 'getElementById')

    // Mock MutationObserver
    mockMutationObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
    ;(global as any).MutationObserver = mockMutationObserver
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should set up containers and observe mutations when valid containers are provided', () => {
    // Mock container element
    const mockContainer = document.createElement('div')
    mockContainer.id = 'orbital'

    // Mock the signature attribute
    mockContainer.getAttribute = jest.fn().mockImplementation((attr: string) => {
      if (attr === 'signature') {
        return 'mock-signature' // Return a mock signature value
      }
      return null
    })

    mockGetElementById.mockReturnValue(mockContainer)

    // Call init function with a valid container ID
    init({ container: 'orbital' })

    // Verify that getElementById was called
    expect(mockGetElementById).toHaveBeenCalledWith('orbital')

    // Verify that the MutationObserver was set up and started observing
    expect(mockMutationObserver).toHaveBeenCalled()

    // Verify that the signature attribute was accessed
    expect(mockContainer.getAttribute).toHaveBeenCalledWith('signature')
  })

  it('should warn when container is not found', () => {
    console.warn = jest.fn()

    // Mock getElementById to return null (container not found)
    mockGetElementById.mockReturnValue(null)

    // Call init function with a missing container
    init({ container: 'missing-container' })

    // Verify that warning was logged
    expect(console.warn).toHaveBeenCalledWith('Container with ID missing-container not found.')
  })

  it('should handle multiple containers', () => {
    // Mock container elements
    const mockContainer1 = document.createElement('div')
    const mockContainer2 = document.createElement('div')
    mockContainer1.id = 'orbital-container-1'
    mockContainer2.id = 'orbital-container-2'

    // Mock the signature attribute for both containers
    mockContainer1.getAttribute = jest.fn().mockImplementation((attr: string) => {
      if (attr === 'signature') {
        return 'signature-1'
      }
      return null
    })

    mockContainer2.getAttribute = jest.fn().mockImplementation((attr: string) => {
      if (attr === 'signature') {
        return 'signature-2'
      }
      return null
    })

    // Return different elements for different IDs
    mockGetElementById.mockImplementation((id: string) => {
      if (id === 'orbital-container-1') return mockContainer1
      if (id === 'orbital-container-2') return mockContainer2
      return null
    })

    // Call init function with multiple containers
    init({ container: ['orbital-container-1', 'orbital-container-2'] })

    // Verify that getElementById was called for each container
    expect(mockGetElementById).toHaveBeenCalledWith('orbital-container-1')
    expect(mockGetElementById).toHaveBeenCalledWith('orbital-container-2')

    // Verify that MutationObservers were set up for both containers
    expect(mockMutationObserver).toHaveBeenCalledTimes(2)

    // Verify that the signature attribute was accessed for both containers
    expect(mockContainer1.getAttribute).toHaveBeenCalledWith('signature')
    expect(mockContainer2.getAttribute).toHaveBeenCalledWith('signature')
  })
})
