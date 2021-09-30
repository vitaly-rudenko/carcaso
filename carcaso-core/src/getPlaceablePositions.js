import { getPlacedTile } from './getPlacedTile.js'
import { getPositionsAround } from './getPositionsAround.js'

export function getPlaceablePositions(map) {
    if (map.length === 0) {
        return [{ x: 0, y: 0 }]
    }

    const positions = []

    for (const placedTile of map) {
        positions.push(
            ...getPositionsAround(placedTile.placement.position)
                .filter(({ x, y }) => positions.every(p => p.x !== x || p.y !== y))
                .filter(({ x, y }) => !getPlacedTile(map, { x, y }))
        )
    }

    return positions
}
