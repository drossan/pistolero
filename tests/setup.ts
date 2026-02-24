import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  get length() {
    return 0
  },
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  get length() {
    return 0
  },
  key: vi.fn(),
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

// Mock AudioContext (Web Audio API)
class MockAudioNode {
  connect = vi.fn()
  disconnect = vi.fn()
}

class MockOscillatorNode extends MockAudioNode {
  start = vi.fn()
  stop = vi.fn()
  frequency = { value: 0 }
}

class MockGainNode extends MockAudioNode {
  gain = { value: 0 }
}

class MockAudioContext {
  createOscillator = vi.fn(() => new MockOscillatorNode())
  createGain = vi.fn(() => new MockGainNode())
  destination = {}
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: MockAudioContext,
})

// Mock Service Worker
const mockServiceWorkerRegistration = {
  update: vi.fn(),
  unregister: vi.fn(),
  installing: null,
  waiting: null,
  active: null,
}

const mockServiceWorkerContainer = {
  register: vi.fn(() => Promise.resolve(mockServiceWorkerRegistration)),
  getRegistration: vi.fn(() => Promise.resolve(mockServiceWorkerRegistration)),
  getRegistrations: vi.fn(() => Promise.resolve([])),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  controller: null,
  ready: Promise.resolve(mockServiceWorkerRegistration),
}

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorkerContainer,
  writable: true,
})

// Mock vibration API (navigator.vibrate)
Object.defineProperty(navigator, 'vibrate', {
  value: vi.fn(),
  writable: true,
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  callback: IntersectionObserverCallback
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  root = null
  rootMargin = ''
  thresholds = []
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 0))
global.cancelAnimationFrame = vi.fn(clearTimeout)

// Mock crypto.randomUUID()
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid-' + Math.random()),
  },
})
