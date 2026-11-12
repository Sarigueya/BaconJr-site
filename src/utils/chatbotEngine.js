// Motor del asistente de Bacon Jr.
// Funciona 100% en el navegador: reconoce palabras clave en el mensaje y responde
// con los datos reales del sitio (productos, ofertas, sucursales, horario…).
// No usa servicios externos ni claves, así que es gratis.
//
// Cada respuesta tiene la forma:
// {
//   text: 'Texto del mensaje',
//   products: [producto, …],                      // tarjetas con botón "Agregar"
//   actions: [{ type: 'link' | 'reply' | 'external' | 'cart', label, to?, href? }],
//   addToCart: { product, quantity },             // agrega al carrito automáticamente
// }

const STOPWORDS = new Set([
  'a', 'al', 'el', 'la', 'los', 'las', 'lo', 'le', 'de', 'del', 'en', 'y', 'o', 'u',
  'con', 'sin', 'por', 'para', 'que', 'me', 'mi', 'mis', 'te', 'tu', 'su', 'se', 'es',
  'un', 'una', 'uno', 'unos', 'unas', 'hay', 'tienen', 'tiene', 'tienes', 'son', 'esta',
  'este', 'eso', 'esa', 'ese', 'quiero', 'quisiera', 'dame', 'favor', 'porfa', 'porfavor',
  'cuanto', 'cuesta', 'cuestan', 'vale', 'valen', 'precio', 'precios', 'hola', 'buenas',
])

const NUMBER_WORDS = {
  un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
}

// Palabras exactas que identifican una categoría completa.
const CATEGORY_WORDS = {
  meats: ['carne', 'carnes', 'cortes', 'asados', 'parrilla', 'parrillada'],
  drinks: ['bebida', 'bebidas', 'tomar', 'beber'],
  desserts: ['postre', 'postres', 'dulce', 'dulces'],
  sides: ['acompanante', 'acompanantes', 'acompanamiento', 'acompanamientos', 'guarnicion', 'guarniciones'],
  sauces: ['salsas', 'aderezo', 'aderezos'],
}

// Raíces de palabras para cada intención (se comparan con el inicio de cada palabra).
const INTENTS = {
  order: ['quier', 'quisier', 'agreg', 'anad', 'pid', 'pedir', 'orden', 'dame', 'regal', 'compr', 'manda'],
  cocktails: ['coctel', 'cocteles', 'coctele', 'trago', 'mojito', 'margarita', 'michelada', 'cocktail', 'mocktail'],
  hours: ['horario', 'hora', 'abre', 'abie', 'abren', 'cierr', 'atiend', 'atencion'],
  location: ['donde', 'ubica', 'direcc', 'sucurs', 'local', 'queda', 'mapa', 'llegar'],
  delivery: ['domicil', 'envio', 'envia', 'entreg', 'delivery', 'recog', 'demor', 'tard'],
  payment: ['pago', 'pagar', 'pagan', 'tarjet', 'efectiv', 'transfer', 'metodo'],
  contact: ['telefon', 'llamar', 'numero', 'whats', 'contact', 'celular', 'humano', 'asesor', 'persona'],
  offers: ['oferta', 'promo', 'descuent', '2x1', 'combo', 'happy', 'especial'],
  recommend: ['recomi', 'recomend', 'sugier', 'suger', 'mejor', 'popular', 'favorit', 'antoj', 'rico'],
  vegetarian: ['vegetarian', 'vegan', 'vegetal'],
  menu: ['menu', 'carta', 'venden', 'platos', 'comida', 'opciones', 'productos'],
  cart: ['carrito', 'pedido', 'total', 'cuenta', 'llevo'],
  thanks: ['gracias', 'genial', 'perfecto', 'excelente', 'listo', 'vale'],
  bye: ['adios', 'chao', 'bye', 'luego', 'vemos'],
  greeting: ['hola', 'buenas', 'buenos', 'hey', 'saludos', 'ola'],
}

const PRONOUNS = ['lo', 'la', 'eso', 'esa', 'ese', 'agregalo', 'agregala', 'anadelo', 'anadela', 'pidelo', 'quierolo']

export function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const tokenize = (text) => normalize(text).split(' ').filter(Boolean)

// "costillas" coincide con "costilla", "helado" con "helados", etc.
function stemOf(word) {
  return word.length > 4 ? word.slice(0, Math.max(4, word.length - 2)) : word
}

const tokenMatches = (token, keyword) => {
  if (keyword.length <= 4) return token === keyword
  return token.startsWith(stemOf(keyword))
}

const hasIntent = (tokens, intent) =>
  tokens.some((token) => INTENTS[intent].some((stem) => token.startsWith(stem)))

function productKeywords(product) {
  const fromName = tokenize(product.name).filter((word) => !STOPWORDS.has(word) && word.length > 2)
  return [...new Set([...fromName, ...(product.keywords ?? []).map(normalize)])]
}

function findCategory(tokens) {
  for (const [id, words] of Object.entries(CATEGORY_WORDS)) {
    if (tokens.some((token) => words.includes(token))) return id
  }
  return null
}

// Devuelve los productos con más palabras en común con el mensaje.
function findProducts(tokens, catalog) {
  const categoryTokens = new Set(Object.values(CATEGORY_WORDS).flat())
  const useful = tokens.filter((token) => !STOPWORDS.has(token) && !categoryTokens.has(token))
  if (useful.length === 0) return []

  let best = 0
  let matches = []
  for (const product of catalog) {
    const keywords = productKeywords(product)
    const score = useful.filter((token) => keywords.some((kw) => tokenMatches(token, kw))).length
    if (score === 0) continue
    if (score > best) {
      best = score
      matches = [product]
    } else if (score === best) {
      matches.push(product)
    }
  }
  return matches
}

function findQuantity(tokens) {
  for (const token of tokens) {
    if (/^\d+$/.test(token)) return Math.min(20, Math.max(1, Number(token)))
    if (NUMBER_WORDS[token]) return NUMBER_WORDS[token]
  }
  return 1
}

const formatMoney = (value) => `$${value}`

const listLines = (items, render) => items.map((item) => `• ${render(item)}`).join('\n')

export function getOpenStatus(schedule, now = new Date()) {
  const [open, close] = schedule[now.getDay()]
  const hour = now.getHours() + now.getMinutes() / 60
  if (hour >= open && hour < close) {
    return `Ahora mismo estamos abiertos hasta las ${close}:00.`
  }
  if (hour < open) {
    return `Ahora estamos cerrados; hoy abrimos a las ${open}:00.`
  }
  const [nextOpen] = schedule[(now.getDay() + 1) % 7]
  return `Ya cerramos por hoy; mañana abrimos a las ${nextOpen}:00.`
}

const MENU_ACTION = { type: 'link', label: 'Ver menú completo', to: '/menu?category=all' }

export function createChatbot({ products, categories, offers, stores, business, fulfillment, payments }) {
  const catalog = [...products, ...offers]
  const categoryLabel = (id) => categories.find((category) => category.id === id)?.label ?? id

  const suggestions = (labels) => labels.map((label) => ({ type: 'reply', label }))

  const fallback = () => ({
    text:
      'Mmm, no logré entenderte. Puedo ayudarte con el menú, precios, ofertas, horario, sucursales, domicilios y formas de pago. También puedo agregar productos a tu carrito, por ejemplo: "quiero 2 costillas".',
    actions: [
      ...suggestions(['Ver el menú', 'Ofertas de hoy', '¿Cuál es el horario?']),
      { type: 'external', label: 'Hablar por WhatsApp', href: business.whatsappUrl },
    ],
  })

  const describeProducts = (matches) => {
    if (matches.length === 1) {
      const [product] = matches
      return {
        text: `${product.name}: ${product.description} Cuesta ${formatMoney(product.price)}.`,
        products: matches,
        lastProduct: product,
      }
    }
    return {
      text: `Encontré estas opciones:\n${listLines(matches, (p) => `${p.name} – ${formatMoney(p.price)}`)}`,
      products: matches,
      lastProduct: null,
    }
  }

  const describeCategory = (categoryId) => {
    const items = products.filter((product) => product.category === categoryId)
    return {
      text: `Esto tenemos en ${categoryLabel(categoryId)}:\n${listLines(
        items,
        (p) => `${p.name} – ${formatMoney(p.price)}`
      )}`,
      products: items,
      actions: [{ type: 'link', label: `Ver ${categoryLabel(categoryId)} en el menú`, to: `/menu?category=${categoryId}` }],
    }
  }

  const handlers = {
    cocktails: () => ({
      text: 'Tenemos coctelería clásica (margarita, mojito, piña colada, michelada y más) y bebidas sin alcohol. Puedes ver ingredientes, preparación y agregarlos al carrito en la sección de Coctelería del menú.',
      actions: [{ type: 'link', label: 'Ver coctelería', to: '/menu#cocteles' }],
    }),
    offers: () => ({
      text: `Estas son las promociones de hoy:\n${listLines(
        offers,
        (o) => `${o.title}: ${o.description} (${formatMoney(o.price)}, antes ${formatMoney(o.originalPrice)})`
      )}`,
      products: offers,
      actions: [{ type: 'link', label: 'Ver ofertas', to: '/#offers' }],
    }),
    hours: () => ({
      text: `Nuestro horario es: ${business.hoursText}. ${getOpenStatus(business.schedule)}`,
      actions: suggestions(['¿Dónde están ubicados?', '¿Hacen domicilios?']),
    }),
    location: () => ({
      text: `Puedes visitarnos en:\n${listLines(stores, (s) => `${s.name}: ${s.address}`)}`,
      actions: suggestions(['¿Cuál es el horario?', '¿Hacen domicilios?']),
    }),
    delivery: () => ({
      text: `Tenemos estas opciones:\n${listLines(fulfillment, (f) => `${f.label}: ${f.description}`)}\nEl tiempo estimado de entrega es de ${business.deliveryTime}.`,
      actions: [MENU_ACTION, ...suggestions(['Formas de pago'])],
    }),
    payment: () => ({
      text: `Aceptamos:\n${listLines(payments, (p) => `${p.label}: ${p.description}`)}`,
      actions: [MENU_ACTION],
    }),
    contact: () => ({
      text: `Puedes llamarnos o escribirnos al ${business.phone}. Si prefieres, te atendemos por WhatsApp.`,
      actions: [{ type: 'external', label: 'Abrir WhatsApp', href: business.whatsappUrl }],
    }),
    recommend: () => {
      const picks = ['meats', 'sides', 'drinks']
        .map((id) => products.find((product) => product.category === id))
        .filter(Boolean)
      const total = picks.reduce((sum, product) => sum + product.price, 0)
      return {
        text: `Mi combinación favorita: ${picks.map((p) => p.name).join(' + ')} por ${formatMoney(
          total
        )}. Y si buscas ahorrar, no te pierdas la oferta del día: ${offers[0].name} a ${formatMoney(offers[0].price)}.`,
        products: [...picks, offers[0]],
      }
    },
    vegetarian: () => {
      const items = products.filter((product) => ['sides', 'desserts'].includes(product.category))
      return {
        text: `Opciones sin carne:\n${listLines(items, (p) => `${p.name} – ${formatMoney(p.price)}`)}`,
        products: items,
      }
    },
    menu: () => ({
      text: `Nuestro menú tiene ${products.length} productos en estas categorías:\n${listLines(
        categories.filter((category) => category.id !== 'all'),
        (c) => `${c.label} (${products.filter((p) => p.category === c.id).length})`
      )}\n¿Qué se te antoja?`,
      actions: [
        MENU_ACTION,
        ...suggestions(['Carnes', 'Bebidas', 'Postres', 'Acompañantes', 'Salsas']),
      ],
    }),
    thanks: () => ({
      text: '¡Con gusto! ¿Te ayudo con algo más?',
      actions: suggestions(['Ver el menú', 'Ofertas de hoy']),
    }),
    bye: () => ({ text: '¡Gracias por visitarnos! Te esperamos en Bacon Jr.' }),
    greeting: () => ({
      text: '¡Hola! ¿Qué se te antoja hoy? Puedo mostrarte el menú, las ofertas o agregar productos a tu carrito.',
      actions: suggestions(['Ver el menú', 'Ofertas de hoy', '¿Qué me recomiendas?']),
    }),
  }

  const INTENT_ORDER = [
    'cocktails', 'offers', 'hours', 'location', 'delivery', 'payment', 'contact',
    'recommend', 'vegetarian', 'menu', 'thanks', 'bye', 'greeting',
  ]

  // context: { lastProduct, cartItems }
  return function reply(message, context = {}) {
    const tokens = tokenize(message)
    if (tokens.length === 0) return fallback()

    const matches = findProducts(tokens, catalog)
    const category = findCategory(tokens)
    const wantsToOrder = hasIntent(tokens, 'order')

    // Carrito: "¿cuánto llevo?", "ver mi pedido"
    if (hasIntent(tokens, 'cart') && !wantsToOrder && matches.length === 0) {
      const items = context.cartItems ?? []
      if (items.length === 0) {
        return { text: 'Tu carrito está vacío. ¿Quieres que te muestre el menú?', actions: [MENU_ACTION] }
      }
      const count = items.reduce((sum, item) => sum + item.quantity, 0)
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return {
        text: `Llevas ${count} producto${count === 1 ? '' : 's'} por un total de ${formatMoney(total)}.`,
        actions: [{ type: 'cart', label: 'Ver carrito' }],
      }
    }

    // Pedido: "quiero 2 costillas", "agrégalo"
    if (wantsToOrder) {
      const quantity = findQuantity(tokens)
      // Si coincide un producto del menú y una oferta, se prefiere el del menú.
      const menuMatches = matches.filter((product) => products.includes(product))
      let target = null
      if (matches.length === 1) target = matches[0]
      else if (menuMatches.length === 1) target = menuMatches[0]
      else if (matches.length === 0 && tokens.some((t) => PRONOUNS.includes(t))) {
        target = context.lastProduct ?? null
      }

      if (target) {
        return {
          text: `¡Listo! Agregué ${quantity} × ${target.name} a tu carrito (${formatMoney(target.price * quantity)}). ¿Algo más para acompañar?`,
          addToCart: { product: target, quantity },
          lastProduct: target,
          actions: [{ type: 'cart', label: 'Ver carrito' }, ...suggestions(['Acompañantes', 'Bebidas'])],
        }
      }
      if (matches.length > 1) {
        return { ...describeProducts(matches), text: '¿Cuál de estos quieres? Toca "Agregar" en el que prefieras.' }
      }
      if (category) return describeCategory(category)
    }

    if (matches.length > 0) return describeProducts(matches)
    if (category) return describeCategory(category)

    for (const intent of INTENT_ORDER) {
      if (hasIntent(tokens, intent)) return handlers[intent]()
    }

    // Preguntas de precio sin producto: "¿cuánto cuesta?"
    if (context.lastProduct && tokens.some((t) => ['cuanto', 'precio', 'cuesta', 'vale'].includes(t))) {
      return describeProducts([context.lastProduct])
    }

    return fallback()
  }
}
