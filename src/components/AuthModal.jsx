import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setErrors({})
  }

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validate = () => {
    const nextErrors = {}
    const cleanEmail = email.trim()
    const isValidEmail = EMAIL_REGEX.test(cleanEmail)

    if (mode === 'register') {
      if (name.trim().length < 2) nextErrors.name = 'Escribe tu nombre completo.'
      if (!isValidEmail) nextErrors.email = 'Ingresa un correo electrónico válido.'
      if (password.length < 8) nextErrors.password = 'La contraseña debe tener al menos 8 caracteres.'
      if (password !== confirmPassword) nextErrors.confirmPassword = 'Las contraseñas no coinciden.'
    } else {
      if (!isValidEmail) nextErrors.email = 'Ingresa un correo electrónico válido.'
      if (password.length < 1) nextErrors.password = 'Ingresa tu contraseña.'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    // Mockup: por ahora no hay lógica real de autenticación.
    onClose()
  }

  const inputClass = (invalid) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm text-carbon placeholder-humo focus:outline-none focus:ring-2 focus:ring-fuego bg-white ${
      invalid ? 'border-brasa' : 'border-arena'
    }`

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión o registrarse"
    >
      <div
        className="my-auto max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-carbon">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </h2>
            <p className="mt-1 text-sm text-humo">
              {mode === 'login'
                ? 'Ingresa con tus credenciales para continuar tu pedido.'
                : 'Regístrate para empezar a ordenar en BACON JR.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-humo hover:text-fuego-oscuro transition-colors"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs: Nuevo / Ya soy cliente */}
        <div className="px-6">
          <div className="flex border border-arena rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-fuego text-carbon'
                  : 'bg-white text-humo hover:text-fuego-oscuro'
              }`}
            >
              Ya soy cliente
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                mode === 'register'
                  ? 'bg-fuego text-carbon'
                  : 'bg-white text-humo hover:text-fuego-oscuro'
              }`}
            >
              Soy nuevo
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 px-6 py-5">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="mb-1 block text-xs font-semibold text-humo">
                Nombre completo
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  clearError('name')
                }}
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                autoCapitalize="words"
                placeholder="Tu nombre"
                className={inputClass(errors.name ? true : false)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'auth-name-error' : undefined}
              />
              {errors.name && (
                <p id="auth-name-error" role="alert" className="mt-1 text-xs font-medium text-brasa">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="mb-1 block text-xs font-semibold text-humo">
              Correo electrónico
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearError('email')
              }}
              required
              inputMode="email"
              autoComplete="email"
              maxLength={120}
              spellCheck={false}
              placeholder="tucorreo@ejemplo.com"
              className={inputClass(Boolean(errors.email))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'auth-email-error' : undefined}
            />
            {errors.email && (
              <p id="auth-email-error" role="alert" className="mt-1 text-xs font-medium text-brasa">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-1 block text-xs font-semibold text-humo">
              Contraseña
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearError('password')
              }}
              required
              minLength={8}
              maxLength={64}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              className={inputClass(Boolean(errors.password))}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'auth-password-error' : undefined}
            />
            {errors.password && (
              <p id="auth-password-error" role="alert" className="mt-1 text-xs font-medium text-brasa">
                {errors.password}
              </p>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-password-confirm" className="mb-1 block text-xs font-semibold text-humo">
                Confirmar contraseña
              </label>
              <input
                id="auth-password-confirm"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  clearError('confirmPassword')
                }}
                required
                minLength={8}
                maxLength={64}
                autoComplete="new-password"
                placeholder="••••••••"
                className={inputClass(Boolean(errors.confirmPassword))}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'auth-confirm-error' : undefined}
              />
              {errors.confirmPassword && (
                <p id="auth-confirm-error" role="alert" className="mt-1 text-xs font-medium text-brasa">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-humo hover:text-fuego-oscuro transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-fuego-oscuro text-white text-sm font-semibold rounded-lg hover:bg-fuego-profundo transition-colors"
          >
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-crema text-center">
          <p className="text-xs text-humo">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-carbon hover:underline"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-carbon hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AuthModal
