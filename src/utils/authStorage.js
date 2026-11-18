const USERS_KEY = 'baconjr_users'
const SESSION_KEY = 'baconjr_session'

export const SOCIAL_PROVIDERS = {
  google: 'Google',
  facebook: 'Facebook',
  apple: 'Apple',
  microsoft: 'Microsoft',
}

export function getUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

export function getActiveSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

const normalize = (email) => email.trim().toLowerCase()

function saveUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function startSession(user, provider = 'email') {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    provider,
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

function findUserByEmail(email) {
  const normalizedEmail = normalize(email)
  return getUsers().find((user) => normalize(user.email) === normalizedEmail)
}

function providerHint(user) {
  const names = (user.providers || []).map((id) => SOCIAL_PROVIDERS[id]).filter(Boolean)
  return names.length ? names.join(' o ') : null
}

/** Cuentas que ya usaron un proveedor social (para el selector de cuentas simulado). */
export function getSocialAccounts(provider) {
  return getUsers()
    .filter((user) => (user.providers || []).includes(provider))
    .map(({ name, email }) => ({ name, email }))
}

export function registerUser({ name, email, phone, password, address }) {
  const users = getUsers()
  const existing = findUserByEmail(email)

  if (existing) {
    const hint = !existing.password && providerHint(existing)
    return {
      ok: false,
      error: hint
        ? `Este correo ya está registrado con ${hint}. Continúa con ${hint}.`
        : 'Este correo ya está registrado. Inicia sesión.',
    }
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: normalize(email),
    phone: phone.trim(),
    password,
    address: address.trim(),
    providers: [],
  }

  saveUsers([...users, newUser])
  return { ok: true, user: startSession(newUser) }
}

export function loginUser({ email, password }) {
  const found = findUserByEmail(email)

  if (found && !found.password) {
    const hint = providerHint(found)
    return {
      ok: false,
      error: `Esta cuenta se creó con ${hint ?? 'una red social'}. Usa el botón "Continuar con ${hint ?? 'tu red social'}".`,
    }
  }

  if (!found || found.password !== password) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' }
  }

  return { ok: true, user: startSession(found) }
}

/**
 * Inicio de sesión con proveedor social (simulado).
 * Si el correo ya existe, vincula el proveedor e inicia sesión.
 * Si no existe, indica que hay que completar el perfil antes de crear la cuenta.
 */
export function socialLogin({ provider, email }) {
  const users = getUsers()
  const normalizedEmail = normalize(email)
  const index = users.findIndex((user) => normalize(user.email) === normalizedEmail)

  if (index === -1) return { ok: true, needsProfile: true }

  const user = users[index]
  const providers = user.providers || []
  if (!providers.includes(provider)) {
    users[index] = { ...user, providers: [...providers, provider] }
    saveUsers(users)
  }

  return { ok: true, user: startSession(users[index], provider) }
}

export function registerSocialUser({ provider, name, email, phone, address }) {
  if (findUserByEmail(email)) {
    return socialLogin({ provider, email })
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: normalize(email),
    phone: phone.trim(),
    password: null,
    address: address.trim(),
    providers: [provider],
  }

  saveUsers([...getUsers(), newUser])
  return { ok: true, user: startSession(newUser, provider) }
}

export function logoutUser() {
  window.localStorage.removeItem(SESSION_KEY)
}
