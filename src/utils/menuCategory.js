import { CATEGORIES } from '../data/products'

const CATEGORY_IDS = new Set(CATEGORIES.map((category) => category.id))

// La coctelería pertenece a Bebidas; en "Todo" también debe mostrarse.
const COCKTAIL_CATEGORIES = new Set(['all', 'drinks'])

// Normaliza el parámetro de la URL: una categoría desconocida equivale a "Todo".
export function resolveMenuCategory(param) {
  return CATEGORY_IDS.has(param) ? param : 'all'
}

export function showsCocktails(category) {
  return COCKTAIL_CATEGORIES.has(category)
}
