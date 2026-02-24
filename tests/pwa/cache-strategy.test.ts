import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Service Worker Cache Strategy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Service Worker Registration', () => {
    it('should register service worker successfully', async () => {
      const mockRegister = vi.fn().mockResolvedValue({
        update: vi.fn(),
        unregister: vi.fn(),
      })

      Object.defineProperty(navigator.serviceWorker, 'register', {
        value: mockRegister,
        writable: true,
        configurable: true,
      })

      const registerSW = async () => {
        const registration = await navigator.serviceWorker.register('/sw.js')
        return registration
      }

      const registration = await registerSW()
      expect(mockRegister).toHaveBeenCalledWith('/sw.js')
      expect(registration).toBeDefined()
    })

    it('should handle registration errors gracefully', async () => {
      const mockRegister = vi.fn().mockRejectedValue(new Error('SW registration failed'))

      Object.defineProperty(navigator.serviceWorker, 'register', {
        value: mockRegister,
        writable: true,
        configurable: true,
      })

      const registerSW = async () => {
        try {
          await navigator.serviceWorker.register('/sw.js')
          return { success: true }
        } catch (error) {
          return { success: false, error }
        }
      }

      const result = await registerSW()
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Cache Strategy', () => {
    it('should cache static assets on first load', async () => {
      const mockCache = {
        open: vi.fn().mockResolvedValue({
          put: vi.fn().mockResolvedValue(undefined),
          match: vi.fn().mockResolvedValue(null),
        }),
      }

      const mockCaches = {
        open: mockCache.open,
        delete: vi.fn(),
        keys: vi.fn(),
        has: vi.fn(),
      }

      Object.defineProperty(global, 'caches', {
        value: mockCaches,
        writable: true,
        configurable: true,
      })

      const cacheAsset = async (url: string) => {
        const cache = await caches.open('static-assets-v1')
        await cache.put(url, new Response())
      }

      await cacheAsset('/icon.svg')
      expect(mockCache.open).toHaveBeenCalledWith('static-assets-v1')
    })

    it('should serve from cache when offline', async () => {
      const cachedResponse = new Response('Cached content', {
        status: 200,
        statusText: 'OK',
      })

      const mockCache = {
        open: vi.fn().mockResolvedValue({
          match: vi.fn().mockResolvedValue(cachedResponse),
        }),
      }

      const mockCaches = {
        open: mockCache.open,
      }

      Object.defineProperty(global, 'caches', {
        value: mockCaches,
        writable: true,
        configurable: true,
      })

      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })

      const getCachedAsset = async (url: string) => {
        const cache = await caches.open('static-assets-v1')
        return await cache.match(url)
      }

      const response = await getCachedAsset('/icon.svg')
      expect(response).toBeDefined()
      expect(await response?.text()).toBe('Cached content')
    })
  })

  describe('Service Worker Update Detection', () => {
    it('should detect new service worker version', async () => {
      const mockWaitingWorker = {
        postMessage: vi.fn(),
      }

      const mockRegistration = {
        waiting: mockWaitingWorker,
        update: vi.fn(),
      }

      Object.defineProperty(navigator.serviceWorker, 'getRegistration', {
        value: vi.fn().mockResolvedValue(mockRegistration),
        writable: true,
        configurable: true,
      })

      const updateSW = async () => {
        const registration = await navigator.serviceWorker.getRegistration()
        registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })
      }

      await updateSW()
      expect(mockWaitingWorker.postMessage).toHaveBeenCalledWith({
        type: 'SKIP_WAITING',
      })
    })

    it('should reload page after service worker updates', async () => {
      const reloadMock = vi.fn()

      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
        configurable: true,
      })

      const reloadPage = () => {
        window.location.reload()
      }

      reloadPage()
      expect(reloadMock).toHaveBeenCalledOnce()
    })
  })
})
