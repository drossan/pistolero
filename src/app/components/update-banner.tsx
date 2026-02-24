import { useEffect, useState } from 'react'

interface UpdateBannerProps {
  onReload?: () => void
}

export function UpdateBanner({ onReload }: UpdateBannerProps) {
  const [hasUpdate, setHasUpdate] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Listen for service worker updates
    const handleSWUpdate = () => {
      setHasUpdate(true)
    }

    // Check for waiting service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setHasUpdate(true)
        }

        // Listen for new service worker installation
        registration.addEventListener('controllerchange', handleSWUpdate)

        return () => {
          registration.removeEventListener('controllerchange', handleSWUpdate)
        }
      })
    }
  }, [])

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration?.waiting) {
          // Send message to waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      }

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('Error updating service worker:', error)
      setIsUpdating(false)
    }
  }

  if (!hasUpdate) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#8B0000] text-white px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔄</span>
        <div>
          <p className="font-bold text-sm">Nueva versión disponible</p>
          <p className="text-xs opacity-90">Actualiza para obtener las últimas mejoras</p>
        </div>
      </div>
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="bg-white text-[#8B0000] px-4 py-2 rounded font-bold text-sm hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
        style={{
          fontFamily: "'Rye', serif",
        }}
      >
        {isUpdating ? 'Actualizando...' : 'Actualizar ahora'}
      </button>
    </div>
  )
}
