import { getRotated } from './rotation.js'

export function getPlacementsForTile(pattern, map) {
    const freePlacements = getFreeMapPlacements(map)
    const placements = []

    for (let rotation = 0; rotation < 4; rotation++) {
        for (const { x, y } of freePlacements) {
            if (isValidTilePlacement(map, { x, y, pattern, rotation })) {
                // ignore tiles that don't change when rotated by certain angle
                if (placements.some(p => p.x === x && p.y === y && getRotated({ pattern, rotation: p.rotation }) === getRotated({ pattern, rotation }))) {
                    continue
                }

                placements.push({ x, y, rotation })
            }
        }
    }

    return placements
}

export function getFreeMapPlacements(map) {
    const placements = []

    for (const { x, y } of map) {
        placements.push(
            ...[
                { x: x - 1, y: y + 0 },
                { x: x + 1, y: y + 0 },
                { x: x + 0, y: y - 1 },
                { x: x + 0, y: y + 1 },
            ]
                .filter(({ x, y }) => placements.every(p => p.x !== x || p.y !== y))
                .filter(({ x, y }) => !getTile(map, { x, y }))
        )
    }

    return placements
}

export function isValidTilePlacement(map, { x, y, pattern, rotation }) {
    const [top, left, _, right, bottom] = getRotated({ pattern, rotation })
    
    const topTile = getTile(map, { x, y: y + 1 })
    if (topTile && getRotated(topTile)[4] !== top) return false
    
    const leftTile = getTile(map, { x: x - 1, y })
    if (leftTile && getRotated(leftTile)[3] !== left) return false

    const rightTile = getTile(map, { x: x + 1, y })
    if (rightTile && getRotated(rightTile)[1] !== right) return false

    const bottomTile = getTile(map, { x, y: y - 1 })
    if (bottomTile && getRotated(bottomTile)[0] !== bottom) return false

    return true
}

export function getTile(map, { x, y }) {
    return map.find(tile => tile.x === x && tile.y === y) || null
}
