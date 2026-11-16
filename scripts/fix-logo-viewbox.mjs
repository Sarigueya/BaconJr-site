import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const logoPath = resolve(projectRoot, 'src', 'assets', 'logos', 'logoBaconjrv2.svg')
const viewHeight = 75
const fallback = { x: 73, y: 104, width: 265, height: viewHeight }

function readClipBounds(svg) {
  const points = []

  for (const [, body] of svg.matchAll(/<clipPath\b[^>]*>([\s\S]*?)<\/clipPath>/g)) {
    for (const [, pathData] of body.matchAll(/\bd="([^"]+)"/g)) {
      const numbers = (pathData.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number)

      for (let index = 0; index + 1 < numbers.length; index += 2) {
        points.push([numbers[index], numbers[index + 1]])
      }
    }
  }

  if (points.length === 0) return null

  return {
    minX: Math.min(...points.map(([x]) => x)),
    maxX: Math.max(...points.map(([x]) => x)),
    minY: Math.min(...points.map(([, y]) => y)),
    maxY: Math.max(...points.map(([, y]) => y)),
  }
}

function setAttribute(tag, name, value) {
  const pattern = new RegExp(`\\b${name}="[^"]*"`)

  if (pattern.test(tag)) return tag.replace(pattern, `${name}="${value}"`)
  return tag.replace(/>$/, ` ${name}="${value}">`)
}

const svg = readFileSync(logoPath, 'utf8')
const rootTag = svg.match(/<svg\b[^>]*>/)?.[0]

if (!rootTag) throw new Error(`No se encontró la etiqueta raíz en ${logoPath}`)

const bounds = readClipBounds(svg)
const x = bounds ? Math.floor(bounds.minX) : fallback.x
const width = bounds ? Math.ceil(bounds.maxX - x) + 1 : fallback.width
const y = bounds
  ? Math.round((bounds.minY + bounds.maxY - viewHeight) / 2)
  : fallback.y
const viewBox = `${x} ${y} ${width} ${viewHeight}`

let nextRoot = setAttribute(rootTag, 'width', String(width))
nextRoot = setAttribute(nextRoot, 'height', String(viewHeight))
nextRoot = setAttribute(nextRoot, 'viewBox', viewBox)

const nextSvg = svg.replace(rootTag, nextRoot)

if (nextSvg !== svg) writeFileSync(logoPath, nextSvg)

console.log(`Logo normalizado: width="${width}" height="${viewHeight}" viewBox="${viewBox}"`)
