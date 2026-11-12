import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import logo from '../assets/brand/logoBaconjrv2.svg'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { loginUser, registerUser } from '../utils/authStorage'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function AuthModal({ isOpen, onClose, onAuthSuccess, fromCheckout = false }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode('login')
      setName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setAddress('')
      setAcceptedPolicy(false)
      setShowPolicy(false)
      setErrors({})
      setAuthError('')
      return
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setErrors({})
    setAuthError('')
  }

  const clearError = (field) => {
    setAuthError('')
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
    const cleanAddress = address.trim()

    if (mode === 'register') {
      if (name.trim().length < 2) nextErrors.name = 'Escribe tu nombre completo.'
      if (!isValidEmail) nextErrors.email = 'Ingresa un correo electrónico válido.'
      if (phone.replace(/\D/g, '').length < 7) {
        nextErrors.phone = 'Ingresa un número de teléfono válido.'
      }
      if (password.length < 6) {
        nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
      }
      if (cleanAddress.length < 5) {
        nextErrors.address = 'Escribe tu dirección completa de entrega.'
      } else if (!/\d/.test(cleanAddress)) {
        nextErrors.address =
          'Incluye al menos un número en tu dirección (ej. Calle 10 # 20-30).'
      }
      if (!acceptedPolicy) {
        nextErrors.policy = 'Debes aceptar el tratamiento de datos personales.'
      }
    } else {
      if (!isValidEmail) nextErrors.email = 'Ingresa un correo electrónico válido.'
      if (password.length < 1) nextErrors.password = 'Ingresa tu contraseña.'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setAuthError('')

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (mode === 'login') {
      const result = loginUser({ email, password })
      if (!result.ok) {
        setAuthError(result.error)
        return
      }
      setPassword('')
      onAuthSuccess?.(result.user, 'login')
    } else {
      const result = registerUser({ name, email, phone, password, address })
      if (!result.ok) {
        setErrors((prev) => ({ ...prev, email: result.error }))
        return
      }
      setPassword('')
      onAuthSuccess?.(result.user, 'register')
    }
  }

  const inputClass = (invalid) =>
    `w-full px-4 py-3 border rounded-xl text-sm text-carbon placeholder-humo focus:outline-none focus:ring-2 focus:ring-fuego bg-white ${
      invalid ? 'border-brasa' : 'border-arena'
    }`

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-carbon/75 p-4 backdrop-blur-sm animate-[offerFade_250ms_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión o crear cuenta"
    >
      <div
        className="relative my-auto flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl bg-crema text-carbon shadow-[0_30px_80px_-20px_rgba(241,90,36,0.55)] ring-1 ring-fuego/30 sm:max-w-2xl animate-[offerPop_350ms_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Botón cerrar estilo factura */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-carbon text-crema shadow-md transition-colors hover:bg-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado estilo factura */}
        <div className="relative bg-carbon px-7 py-5 text-crema">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuego/25 blur-3xl"
          />
          <div className="relative flex items-center gap-4">
            <img src={logo} alt="Bacon Jr." className="h-12 w-auto" />
            <div className="border-l border-crema/20 pl-4">
              <p className="text-xs font-bold tracking-[0.2em] text-dorado uppercase">
                {mode === 'login' ? 'Acceso de clientes' : 'Registro rápido'}
              </p>
              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                {mode === 'login' ? 'Inicia sesión en Bacon Jr.' : 'Crea tu cuenta'}
              </h2>
            </div>
          </div>
          {fromCheckout && (
            <p className="relative mt-3 rounded-xl border border-dorado/30 bg-white/10 px-3.5 py-2 text-xs text-crema">
              Inicia sesión o regístrate para confirmar tu pedido. Tu carrito se conservará intacto.
            </p>
          )}
        </div>

        {/* Pestañas: Iniciar sesión / Crear cuenta */}
        <div className="border-b border-arena bg-white px-7 pt-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-arena bg-crema p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`cursor-pointer rounded-lg py-2.5 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-fuego-oscuro text-white shadow-sm'
                  : 'text-humo hover:text-carbon'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`cursor-pointer rounded-lg py-2.5 text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-fuego-oscuro text-white shadow-sm'
                  : 'text-humo hover:text-carbon'
              }`}
            >
              Crear cuenta
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 overflow-y-auto px-7 py-6">
          {authError && (
            <div
              role="alert"
              className="rounded-xl border border-brasa bg-brasa/10 px-4 py-3 text-xs font-semibold text-brasa"
            >
              {authError}
            </div>
          )}

          {mode === 'login' ? (
            <>
              <div>
                <label htmlFor="auth-email" className="mb-1.5 block text-xs font-semibold text-carbon">
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
                  placeholder="tucorreo@ejemplo.com"
                  className={inputClass(Boolean(errors.email))}
                />
                {errors.email && (
                  <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="auth-password" className="mb-1.5 block text-xs font-semibold text-carbon">
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
                  maxLength={64}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClass(Boolean(errors.password))}
                />
                {errors.password && (
                  <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                    {errors.password}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="auth-name" className="mb-1.5 block text-xs font-semibold text-carbon">
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
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Tu nombre"
                    className={inputClass(Boolean(errors.name))}
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="auth-phone" className="mb-1.5 block text-xs font-semibold text-carbon">
                    Teléfono
                  </label>
                  <input
                    id="auth-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value)
                      clearError('phone')
                    }}
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={20}
                    placeholder="300 123 4567"
                    className={inputClass(Boolean(errors.phone))}
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="auth-email" className="mb-1.5 block text-xs font-semibold text-carbon">
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
                    placeholder="tucorreo@ejemplo.com"
                    className={inputClass(Boolean(errors.email))}
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="auth-password" className="mb-1.5 block text-xs font-semibold text-carbon">
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
                    maxLength={64}
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    className={inputClass(Boolean(errors.password))}
                  />
                  {errors.password && (
                    <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="auth-address" className="mb-1.5 block text-xs font-semibold text-carbon">
                    Dirección de entrega
                  </label>
                  <input
                    id="auth-address"
                    type="text"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value)
                      clearError('address')
                    }}
                    required
                    autoComplete="street-address"
                    maxLength={140}
                    placeholder="Calle 10 # 20-30, Barrio..."
                    className={inputClass(Boolean(errors.address))}
                  />
                  {errors.address && (
                    <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkbox obligatorio + política desplegable */}
              <div className="rounded-xl border border-arena bg-white p-3.5">
                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-carbon">
                  <input
                    type="checkbox"
                    checked={acceptedPolicy}
                    onChange={(event) => {
                      setAcceptedPolicy(event.target.checked)
                      clearError('policy')
                    }}
                    className="mt-0.5 h-4 w-4 accent-fuego-oscuro"
                  />
                  <span>
                    Acepto el tratamiento de mis datos personales.{' '}
                    <button
                      type="button"
                      onClick={() => setShowPolicy((prev) => !prev)}
                      className="font-bold text-fuego-oscuro underline hover:text-fuego-profundo"
                    >
                      {showPolicy ? 'Ocultar política' : 'Ver política'}
                    </button>
                  </span>
                </label>

                {showPolicy && (
                  <p className="mt-2.5 border-t border-arena pt-2.5 text-[11px] leading-relaxed text-humo">
                    <strong>Política de Tratamiento de Datos Personales:</strong> Los datos
                    suministrados (nombre, teléfono, correo y dirección) se guardan en el
                    almacenamiento local de tu navegador con el único propósito de agilizar tus
                    pedidos y emitir tu factura en BACON JR. Puedes cerrar sesión en cualquier
                    momento.
                  </p>
                )}

                {errors.policy && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-brasa">
                    {errors.policy}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={mode === 'register' && !acceptedPolicy}
            className={`w-full rounded-xl py-3.5 text-sm font-bold transition-colors ${
              mode === 'register' && !acceptedPolicy
                ? 'cursor-not-allowed bg-arena text-humo opacity-70'
                : 'cursor-pointer bg-fuego-oscuro text-white hover:bg-fuego-profundo'
            }`}
          >
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AuthModal