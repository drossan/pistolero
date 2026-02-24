import { useState } from 'react'

interface LoginModalProps {
  onLogin: (username: string) => void
  onClose: () => void
}

export function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (username.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres')
      return
    }

    if (username.trim().length > 15) {
      alert('El nombre no puede tener más de 15 caracteres')
      return
    }

    setIsLoading(true)
    try {
      await onLogin(username.trim())
    } catch (error) {
      console.error('Login error:', error)
      alert('Error al iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="border-4 border-black bg-[#d4c5a0] p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <h2
          className="text-2xl sm:text-3xl mb-6 text-center"
          style={{ fontFamily: "'Rye', serif" }}
        >
          IDENTIFÍCATE
        </h2>

        <p
          className="text-center mb-6 text-sm"
          style={{ fontFamily: "'Special Elite', monospace" }}
        >
          Elige un nombre de vaquero para el duelo
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm mb-2"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              NOMBRE
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={15}
              placeholder="Sheriff"
              className="w-full border-3 border-black p-3 text-lg bg-[#e8d5a3] focus:outline-none focus:ring-2 focus:ring-black"
              style={{ fontFamily: "'Special Elite', monospace" }}
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs mt-1 opacity-70" style={{ fontFamily: '"Special Elite", monospace' }}>
              {username.length}/15 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || username.trim().length < 3}
            className="w-full border-3 border-black bg-[#e8d5a3] p-4 text-xl hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0"
            style={{ fontFamily: "'Rye', serif" }}
          >
            {isLoading ? 'CARGANDO...' : 'COMENZAR'}
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-4 border-2 border-black bg-[#e8d5a3] p-3 text-sm hover:bg-[#d4c5a0] opacity-70"
          style={{ fontFamily: "'Special Elite', monospace" }}
        >
          CANCELAR
        </button>

        {/* Future GitHub OAuth */}
        {/* <div className="mt-6 pt-6 border-t-2 border-black">
          <p className="text-center text-sm mb-3 opacity-70" style={{ fontFamily: "'Special Elite', monospace' }}>
            O continúa con
          </p>
          <button
            onClick={() => {}}
            className="w-full border-2 border-black bg-black text-white p-3 text-sm hover:bg-gray-800 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Special Elite', monospace' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </button>
        </div> */}
      </div>
    </div>
  )
}
