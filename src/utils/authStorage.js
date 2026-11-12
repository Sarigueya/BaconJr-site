const USERS_KEY = 'baconjr_users'
const SESSION_KEY = 'baconjr_session'

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

export function registerUser({ name, email, phone, password, address }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const exists = users.some(
    (user) => user.email.trim().toLowerCase() === normalizedEmail
  )

  if (exists) {
    return { ok: false, error: 'Este correo ya está registrado. Inicia sesión.' }
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password,
    address: address.trim(),
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))

  const session = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return { ok: true, user: session }
}

export function loginUser({ email, password }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const found = users.find(
    (user) =>
      user.email.trim().toLowerCase() === normalizedEmail &&
      user.password === password
  )

  if (!found) {
    return { ok: false, error: 'Correo o contraseña incorrectos.' }
  }

  const session = {
    id: found.id,
    name: found.name,
    email: found.email,
    phone: found.phone,
    address: found.address,
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return { ok: true, user: session }
}

export function logoutUser() {
  window.localStorage.removeItem(SESSION_KEY)
}