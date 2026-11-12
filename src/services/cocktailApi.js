// Cliente de TheCocktailDB (https://www.thecocktaildb.com/api.php).
// Usa la clave pública de pruebas "1", que es gratuita y no requiere registro.
import { COCKTAIL_PRICES, INGREDIENT_ES } from '../data/cocktails'

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'

// Guarda los cócteles ya consultados para no repetir peticiones.
const cache = new Map()

async function request(path, signal) {
  const response = await fetch(`${BASE_URL}/${path}`, { signal })
  if (!response.ok) {
    throw new Error(`TheCocktailDB respondió ${response.status}`)
  }
  const data = await response.json()
  // Sin resultados la API devuelve { drinks: null } (o un texto en algunos filtros).
  return Array.isArray(data.drinks) ? data.drinks : []
}

const translateIngredient = (name) => INGREDIENT_ES[name.toLowerCase()] ?? name

// Convierte la respuesta de la API al mismo formato que los productos del menú,
// para que funcione con las tarjetas, el modal y el carrito.
export function toProduct(drink) {
  const ingredients = []
  for (let i = 1; i <= 15; i += 1) {
    const name = drink[`strIngredient${i}`]?.trim()
    if (!name) continue
    ingredients.push({
      name: translateIngredient(name),
      measure: drink[`strMeasure${i}`]?.trim() ?? '',
    })
  }

  const isAlcoholic = drink.strAlcoholic !== 'Non alcoholic'
  const mainIngredients = ingredients.slice(0, 3).map((item) => item.name.toLowerCase())

  return {
    id: `cocktail-${drink.idDrink}`,
    apiId: drink.idDrink,
    name: drink.strDrink,
    image: `${drink.strDrinkThumb}/medium`,
    imageLarge: drink.strDrinkThumb,
    description: mainIngredients.length
      ? `Con ${mainIngredients.join(', ').replace(/, ([^,]*)$/, ' y $1')}.`
      : 'Cóctel de la casa.',
    ingredients,
    instructions: drink.strInstructionsES || drink.strInstructions || '',
    glass: drink.strGlass ?? '',
    isAlcoholic,
    categoryLabel: isAlcoholic ? 'Cóctel' : 'Sin alcohol',
    notePlaceholder: 'Ej. sin hielo, menos dulce, sin escarchar…',
    price: isAlcoholic ? COCKTAIL_PRICES.alcoholic : COCKTAIL_PRICES.nonAlcoholic,
  }
}

export async function getCocktail(id, signal) {
  if (cache.has(id)) return cache.get(id)
  const [drink] = await request(`lookup.php?i=${encodeURIComponent(id)}`, signal)
  if (!drink) throw new Error(`No se encontró el cóctel ${id}`)
  const product = toProduct(drink)
  cache.set(id, product)
  return product
}

// Si un cóctel falla se omite; solo hay error si fallan todos.
export async function getCocktails(ids, signal) {
  const results = await Promise.allSettled(ids.map((id) => getCocktail(id, signal)))
  signal?.throwIfAborted()
  const items = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
  if (items.length === 0 && ids.length > 0) throw results[0].reason
  return items
}

export async function searchCocktails(query, signal) {
  const drinks = await request(`search.php?s=${encodeURIComponent(query)}`, signal)
  return drinks.map((drink) => {
    const product = toProduct(drink)
    cache.set(drink.idDrink, product)
    return product
  })
}
