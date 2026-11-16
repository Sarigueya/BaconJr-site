import { useCallback, useEffect, useState } from 'react'
import { FEATURED_COCKTAILS } from '../data/cocktails'
import { getCocktails, searchCocktails } from '../services/cocktailApi'

const SEARCH_DELAY_MS = 400
const MAX_SEARCH_RESULTS = 24

// Carga la carta de cócteles (por pestaña) o los resultados del buscador.
// - tab: 'alcoholic' | 'nonAlcoholic'
// - query: texto del buscador (se busca desde 2 letras)
// - limit: cuántos cócteles de la carta mostrar
export function useCocktails({ tab, query, limit }) {
  const [result, setResult] = useState({ key: null, mode: null, items: [], total: 0, error: null })
  const [attempt, setAttempt] = useState(0)

  const search = query.trim()
  const isSearch = search.length >= 2
  const mode = isSearch ? `search:${search.toLowerCase()}` : `tab:${tab}`
  const requestKey = `${mode}|${isSearch ? '' : limit}|${attempt}`

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(
      async () => {
        try {
          if (isSearch) {
            const items = await searchCocktails(search, controller.signal)
            setResult({ key: requestKey, mode, items: items.slice(0, MAX_SEARCH_RESULTS), total: items.length, error: null })
          } else {
            const ids = FEATURED_COCKTAILS[tab]
            const items = await getCocktails(ids.slice(0, limit), controller.signal)
            setResult({ key: requestKey, mode, items, total: ids.length, error: null })
          }
        } catch (error) {
          if (error.name === 'AbortError') return
          setResult({ key: requestKey, mode, items: [], total: 0, error })
        }
      },
      isSearch ? SEARCH_DELAY_MS : 0
    )

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [requestKey, mode, isSearch, search, tab, limit])

  const isLoading = result.key !== requestKey
  // Al pedir "ver más" se siguen mostrando los cócteles ya cargados.
  const keepsPrevious = isLoading && result.mode === mode && !result.error

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  return {
    items: isLoading && !keepsPrevious ? [] : result.items,
    total: result.total,
    isLoading,
    isLoadingMore: keepsPrevious,
    error: isLoading ? null : result.error,
    isSearch,
    retry,
  }
}
