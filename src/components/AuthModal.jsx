import { useEffect, useState } from 'react'

function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    // Mockup: por ahora no hay lógica real de autenticación.
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión o registrarse"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-black">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {mode === 'login'
                ? 'Ingresa con tus credenciales para continuar tu pedido.'
                 : 'Regístrate para empezar a ordenar en BACON JR.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-neutral-500 hover:text-black transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs: Nuevo / Ya soy cliente */}
        <div className="px-6">
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-black text-white'
                  : 'bg-white text-neutral-500 hover:text-black'
              }`}
            >
              Ya soy cliente
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                mode === 'register'
                  ? 'bg-black text-white'
                  : 'bg-white text-neutral-500 hover:text-black'
              }`}
            >
              Soy nuevo
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-semibold text-neutral-600 mb-1">
                Nombre completo
              </label>
              <input
                id="auth-name"
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-neutral-600 mb-1">
              Correo electrónico
            </label>
            <input
              id="auth-email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold text-neutral-600 mb-1">
              Contraseña
            </label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-password-confirm" className="block text-xs font-semibold text-neutral-600 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="auth-password-confirm"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-neutral-500 hover:text-black transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 text-center">
          <p className="text-xs text-neutral-500">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-black hover:underline"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-black hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal