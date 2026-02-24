import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { UpdateBanner } from '../../src/app/components/update-banner'

describe('UpdateBanner Component', () => {
  const mockWaitingWorker = {
    postMessage: vi.fn(),
  }

  const mockServiceWorker = {
    ready: Promise.resolve({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      waiting: null,
    }),
    getRegistration: vi.fn().mockResolvedValue({
      waiting: null,
    }),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('navigator', {
      ...navigator,
      serviceWorker: mockServiceWorker,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should not render when there is no update', () => {
    render(<UpdateBanner />)

    expect(screen.queryByText('Nueva versión disponible')).not.toBeInTheDocument()
  })

  it('should render when service worker has waiting version', async () => {
    mockServiceWorker.ready = Promise.resolve({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      waiting: mockWaitingWorker,
    })

    render(<UpdateBanner />)

    await waitFor(() => {
      expect(screen.getByText('Nueva versión disponible')).toBeInTheDocument()
    })
  })

  it('should call postMessage on update button click', async () => {
    mockServiceWorker.ready = Promise.resolve({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      waiting: mockWaitingWorker,
    })

    mockServiceWorker.getRegistration.mockResolvedValue({
      waiting: mockWaitingWorker,
    })

    const { getByText } = render(<UpdateBanner />)

    await waitFor(() => {
      expect(screen.getByText('Nueva versión disponible')).toBeInTheDocument()
    })

    const updateButton = getByText('Actualizar ahora')

    // Wrap click in act to handle state updates
    await act(async () => {
      updateButton.click()
    })

    // Wait for the async handleUpdate to complete
    await waitFor(() => {
      expect(mockWaitingWorker.postMessage).toHaveBeenCalledWith({
        type: 'SKIP_WAITING',
      })
    })
  })

  it('should reload page after update', async () => {
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
      configurable: true,
    })

    mockServiceWorker.ready = Promise.resolve({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      waiting: mockWaitingWorker,
    })

    mockServiceWorker.getRegistration.mockResolvedValue({
      waiting: mockWaitingWorker,
    })

    const { getByText } = render(<UpdateBanner />)

    await waitFor(() => {
      expect(screen.getByText('Nueva versión disponible')).toBeInTheDocument()
    })

    const updateButton = getByText('Actualizar ahora')

    await act(async () => {
      updateButton.click()
    })

    await waitFor(
      () => {
        expect(reloadMock).toHaveBeenCalled()
      },
      { timeout: 2000 }
    )
  })

  it('should show updating text while updating', async () => {
    mockServiceWorker.ready = Promise.resolve({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      waiting: mockWaitingWorker,
    })

    mockServiceWorker.getRegistration.mockResolvedValue({
      waiting: mockWaitingWorker,
    })

    const { getByText } = render(<UpdateBanner />)

    await waitFor(() => {
      expect(screen.getByText('Nueva versión disponible')).toBeInTheDocument()
    })

    const updateButton = getByText('Actualizar ahora')

    // Click and immediately check for updating text
    await act(async () => {
      updateButton.click()
    })

    // Use waitFor to catch the updating state before reload happens
    await waitFor(
      () => {
        expect(getByText('Actualizando...')).toBeInTheDocument()
      },
      { timeout: 100 }
    )
  })
})
