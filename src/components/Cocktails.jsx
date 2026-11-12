import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import { COCKTAIL_PRICES, COCKTAIL_TABS } from '../data/cocktails'
import { useCocktails } from '../hooks/useCocktails'
import { formatPrice } from '../utils/formatPrice'

const PAGE_SIZE = 8

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-arena bg-white" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-arena/60" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-arena/70" />
        <div className="h-3 w-full animate-pulse rounded bg-arena/50" />
        <div className="h-8 w-1/3 animate-pulse rounded bg-arena/50" />
      </div>
    </div>
  )
}

function Cocktails() {
  const [tab, setTab] = useState(COCKTAIL_TABS[0].id)
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState(null)

  const { items, total, isLoading, isLoadingMore, error, isSearch, retry } = useCocktails({
    tab,
    query,
    limit,
  })

  const changeTab = (id) => {
    setTab(id)
    setQuery('')
    setLimit(PAGE_SIZE)
  }

  const showSkeleton = isLoading && !isLoadingMore
  const canLoadMore = !isSearch && !error && items.length > 0 && items.length < total

  return (
    <section id="cocteles" className="border-t border-arena bg-crema py-12 md:py-16" aria-labelledby="cocteles-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 id="cocteles-title" className="mb-3 text-3xl font-bold text-carbon md:text-4xl">
            Coctelería
          </h2>
          <p className="mx-auto max-w-md text-humo">
            Clásicos para acompañar tu asado. Cócteles a {formatPrice(COCKTAIL_PRICES.alcoholic)} y
            bebidas sin alcohol a {formatPrice(COCKTAIL_PRICES.nonAlcoholic)}.
          </p>
        </div>

        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div role="tablist" aria-label="Tipo de bebida" className="inline-flex rounded-full border border-arena bg-white p-1">
            {COCKTAIL_TABS.map((option) => {
              const isActive = !isSearch && tab === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => changeTab(option.id)}
                  className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego ${
                    isActive ? 'bg-carbon text-dorado' : 'text-humo hover:text-fuego-oscuro'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <label htmlFor="cocktail-search" className="sr-only">
              Buscar cóctel
            </label>
            <svg
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-humo"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
            </svg>
            <input
              id="cocktail-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar: mojito, margarita…"
              autoComplete="off"
              className="w-full rounded-full border border-arena bg-white py-2.5 pr-4 pl-9 text-sm text-carbon placeholder-humo focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-arena bg-white p-8 text-center">
            <p className="font-semibold text-carbon">No pudimos cargar la coctelería.</p>
            <p className="mt-1 text-sm text-humo">Revisa tu conexión a internet e inténtalo de nuevo.</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 cursor-pointer rounded-lg bg-fuego-oscuro px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-fuego-profundo"
            >
              Reintentar
            </button>
          </div>
        ) : showSkeleton ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Cargando cócteles">
            {Array.from({ length: isSearch ? 4 : PAGE_SIZE }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-humo">
            No encontramos cócteles con “{query.trim()}”. Prueba con otro nombre en inglés, como “sour” o “punch”.
          </p>
        ) : (
          <>
            {isSearch && (
              <p className="mb-4 text-sm text-humo" aria-live="polite">
                {total} resultado{total === 1 ? '' : 's'} para “{query.trim()}”
                {total > items.length ? ` (mostrando ${items.length})` : ''}
              </p>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((cocktail) => (
                <ProductCard key={cocktail.id} product={cocktail} onView={setSelected} />
              ))}
            </div>
          </>
        )}

        {canLoadMore && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setLimit((value) => value + PAGE_SIZE)}
              disabled={isLoadingMore}
              className="cursor-pointer rounded-lg border border-carbon px-6 py-2.5 text-sm font-semibold text-carbon transition-colors hover:bg-carbon hover:text-dorado disabled:cursor-wait disabled:opacity-60"
            >
              {isLoadingMore ? 'Cargando…' : 'Ver más cócteles'}
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-humo">
          Recetas e imágenes:{' '}
          <a
            href="https://www.thecocktaildb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-fuego-oscuro"
          >
            TheCocktailDB
          </a>
        </p>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

export default Cocktails
