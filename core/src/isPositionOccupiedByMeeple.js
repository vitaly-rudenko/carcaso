import { getPatternMatrix } from './getPatternMatrix.js'
import { getTile } from './getTile.js'
import { rotatePattern } from './rotatePattern.js'

/**
 * @param {import('./types').Map} map 
 * @param {import('./types').Position} tilePosition 
 * @param {import('./types').Position} meeplePosition 
 */
export function isPositionOccupiedByMeeple(map, tilePosition, meeplePosition) {
  return false
}

/** @param {import('./types').Map} map */
export function buildMapMatrix(map) {
  const minX = Math.min(...map.map(tile => tile.placement.position.x))
  const maxX = Math.max(...map.map(tile => tile.placement.position.x))
  const minY = Math.min(...map.map(tile => tile.placement.position.y))
  const maxY = Math.max(...map.map(tile => tile.placement.position.y))

  const mapMatrix = Array.from(
    new Array((maxY - minY + 1) * 5),
    () => new Array((maxX - minX + 1) * 5).fill(null)
  )

  for (let tx = minX; tx <= maxX; tx++) {
    for (let ty = minY; ty <= maxY; ty++) {
      const tile = getTile(map, { x: tx, y: ty })
      if (!tile) continue

      const rotatedPattern = rotatePattern(tile.pattern, tile.placement.rotation)
      const tileMatrix = getPatternMatrix(rotatedPattern)

      for (let px = 0; px < 5; px++) {
        for (let py = 0; py < 5; py++) {
          const mx = tx * 5 + px - minX * 5
          const my = ty * 5 + (4 - py) - minY * 5

          mapMatrix[my][mx] = tileMatrix[py][px]
        }
      }
    }
  }

  return mapMatrix
}
