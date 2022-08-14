import { getTile } from './getTile.js'
import { getPositionsAround } from './getPositionsAround.js'

/**
 * Get all placeable positions on a map.
 * 
 * @param {import('./types').Map} map 
 * @returns {import('./types').Position[]}
 */
export function getPlaceablePositions(map) {
    if (map.length === 0) {
        return [{ x: 0, y: 0 }]
    }

    const positions = []

    for (const tile of map) {
        positions.push(
            ...getPositionsAround(tile.placement.position)
                .filter(({ x, y }) => positions.every(p => p.x !== x || p.y !== y))
                .filter(({ x, y }) => !getTile(map, { x, y }))
        )
    }

    return positions
}
