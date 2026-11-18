import { useState } from 'react'
import {
  SOCIAL_PROVIDERS,
  getSocialAccounts,
  registerSocialUser,
  socialLogin,
} from '../utils/authStorage'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Logos oficiales simplificados (SVG en línea, sin dependencias). */
const ICONS = {
  google: (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.4z" />
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
      <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z" />
      <path fill="#00A4EF" d="M1 12.5h10.5V23H1z" />
      <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z" />
    </svg>
  ),
}

const inputClass = (invalid) =>
  `w-full px-4 py-3 border rounded-xl text-sm text-carbon placeholder-humo focus:outline-none focus:ring-2 focus:ring-fuego bg-white ${
    invalid ? 'border-brasa' : 'border-arena'
  }`

function FieldError({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="mt-1 text-xs font-medium text-brasa">
      {children}
    </p>
  )
}

/** Botones "Continuar con ..." que se muestran sobre el formulario de correo. */
export function SocialButtons({ mode, onSelect }) {
  const verb = mode === 'register' ? 'Regístrate' : 'Continúa'

  return (
    <div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {Object.entries(SOCIAL_PROVIDERS).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-arena bg-white px-4 py-3 text-sm font-semibold text-carbon transition-colors hover:border-fuego hover:bg-crema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
          >
            {ICONS[id]}
            <span>
              {verb} con {label}
            </span>
          </button>
        ))}
      </div>

      <div className="my-5 flex items-center gap-3 text-[11px] font-bold tracking-[0.15em] text-humo uppercase">
        <span className="h-px flex-1 bg-arena" />
        o con tu correo
        <span className="h-px flex-1 bg-arena" />
      </div>
    </div>
  )
}

/**
 * Flujo simulado de OAuth: 1) selector/consentimiento de la cuenta del proveedor,
 * 2) si la cuenta es nueva, completar teléfono y dirección para los pedidos.
 * Para producción, el paso 1 se reemplaza por el SDK real del proveedor.
 */
export function SocialAuthFlow({ provider, onBack, onSuccess }) {
  const label = SOCIAL_PROVIDERS[provider]
  const [savedAccounts] = useState(() => getSocialAccounts(provider))
  const [stage, setStage] = useState(savedAccounts.length ? 'choose' : 'account')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)
  const [errors, setErrors] = useState({})
  const [isConnecting, setIsConnecting] = useState(false)

  const clearError = (field) =>
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })

  // Simula el viaje de ida y vuelta al proveedor.
  const connect = (account) => {
    setIsConnecting(true)
    window.setTimeout(() => {
      setIsConnecting(false)
      const result = socialLogin({ provider, email: account.email })
      if (result.needsProfile) {
        setName(account.name)
        setEmail(account.email)
        setStage('profile')
        return
      }
      onSuccess(result.user, 'login')
    }, 700)
  }

  const handleAccountSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (name.trim().length < 2) nextErrors.name = 'Escribe tu nombre completo.'
    if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = 'Ingresa un correo electrónico válido.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    connect({ name: name.trim(), email: email.trim() })
  }

  const handleProfileSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    const cleanAddress = address.trim()
    if (phone.replace(/\D/g, '').length < 7) nextErrors.phone = 'Ingresa un número de teléfono válido.'
    if (cleanAddress.length < 5) {
      nextErrors.address = 'Escribe tu dirección completa de entrega.'
    } else if (!/\d/.test(cleanAddress)) {
      nextErrors.address = 'Incluye al menos un número en tu dirección (ej. Calle 10 # 20-30).'
    }
    if (!acceptedPolicy) nextErrors.policy = 'Debes aceptar el tratamiento de datos personales.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const result = registerSocialUser({ provider, name, email, phone, address })
    if (result.ok) onSuccess(result.user, 'register')
  }

  const backButton = (
    <button
      type="button"
      onClick={stage === 'profile' || (stage === 'account' && savedAccounts.length) ? () => {
        setErrors({})
        setStage(stage === 'profile' ? 'account' : 'choose')
      } : onBack}
      className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-fuego-oscuro hover:text-fuego-profundo"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Volver
    </button>
  )

  const providerHeader = (
    <div className="flex items-center gap-3 rounded-2xl border border-arena bg-white px-4 py-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crema">
        {ICONS[provider]}
      </span>
      <div>
        <p className="text-sm font-bold text-carbon">
          {stage === 'profile' ? `Conectado con ${label}` : `Continuar con ${label}`}
        </p>
        <p className="text-xs text-humo">
          {stage === 'profile'
            ? email
            : `Bacon Jr. recibirá tu nombre y correo de ${label}.`}
        </p>
      </div>
    </div>
  )

  if (isConnecting) {
    return (
      <div className="flex flex-col items-center gap-3 px-7 py-14 text-center" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow ring-1 ring-arena">
          {ICONS[provider]}
        </span>
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-arena border-t-fuego" />
        <p className="text-sm font-semibold text-carbon">Conectando con {label}…</p>
      </div>
    )
  }

  if (stage === 'choose') {
    return (
      <div className="space-y-4 overflow-y-auto px-7 py-6">
        {backButton}
        {providerHeader}
        <p className="text-xs font-semibold text-carbon">Elige una cuenta</p>
        <ul className="divide-y divide-arena overflow-hidden rounded-xl border border-arena bg-white">
          {savedAccounts.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                onClick={() => connect(account)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-crema"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuego-oscuro text-sm font-black text-white">
                  {account.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-carbon">{account.name}</span>
                  <span className="block truncate text-xs text-humo">{account.email}</span>
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setStage('account')}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-fuego-oscuro transition-colors hover:bg-crema"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-fuego-oscuro text-lg">
                +
              </span>
              Usar otra cuenta
            </button>
          </li>
        </ul>
      </div>
    )
  }

  if (stage === 'account') {
    return (
      <form onSubmit={handleAccountSubmit} noValidate className="space-y-4 overflow-y-auto px-7 py-6">
        {backButton}
        {providerHeader}
        <div>
          <label htmlFor="social-name" className="mb-1.5 block text-xs font-semibold text-carbon">
            Nombre de tu cuenta de {label}
          </label>
          <input
            id="social-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              clearError('name')
            }}
            maxLength={80}
            autoComplete="name"
            placeholder="Tu nombre"
            className={inputClass(Boolean(errors.name))}
          />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <label htmlFor="social-email" className="mb-1.5 block text-xs font-semibold text-carbon">
            Correo de {label}
          </label>
          <input
            id="social-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              clearError('email')
            }}
            inputMode="email"
            maxLength={120}
            autoComplete="email"
            placeholder={provider === 'google' ? 'tucorreo@gmail.com' : 'tucorreo@ejemplo.com'}
            className={inputClass(Boolean(errors.email))}
          />
          <FieldError>{errors.email}</FieldError>
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-fuego-oscuro py-3.5 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo"
        >
          Autorizar y continuar
        </button>
        <p className="text-center text-[11px] text-humo">
          Simulación de inicio de sesión: no se envía nada a {label}.
        </p>
      </form>
    )
  }

  // stage === 'profile'
  return (
    <form onSubmit={handleProfileSubmit} noValidate className="space-y-4 overflow-y-auto px-7 py-6">
      {backButton}
      {providerHeader}
      <p className="text-sm text-carbon">
        ¡Hola, <strong>{name}</strong>! Solo falta tu teléfono y dirección para entregarte los pedidos.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="social-phone" className="mb-1.5 block text-xs font-semibold text-carbon">
            Teléfono
          </label>
          <input
            id="social-phone"
            type="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value)
              clearError('phone')
            }}
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder="300 123 4567"
            className={inputClass(Boolean(errors.phone))}
          />
          <FieldError>{errors.phone}</FieldError>
        </div>
        <div>
          <label htmlFor="social-address" className="mb-1.5 block text-xs font-semibold text-carbon">
            Dirección de entrega
          </label>
          <input
            id="social-address"
            type="text"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value)
              clearError('address')
            }}
            autoComplete="street-address"
            maxLength={140}
            placeholder="Calle 10 # 20-30, Barrio..."
            className={inputClass(Boolean(errors.address))}
          />
          <FieldError>{errors.address}</FieldError>
        </div>
      </div>
      <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-arena bg-white p-3.5 text-xs text-carbon">
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
          Acepto el tratamiento de mis datos personales (nombre, correo, teléfono y dirección) para
          gestionar mis pedidos en BACON JR.
        </span>
      </label>
      <FieldError>{errors.policy}</FieldError>
      <button
        type="submit"
        className="w-full cursor-pointer rounded-xl bg-fuego-oscuro py-3.5 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo"
      >
        Crear cuenta con {label}
      </button>
    </form>
  )
}
