import { getRotated } from './rotation.js'

export function getPlacements(pattern, map) {
    const freePlacements = getFreePlacements(map)
    const placements = []

    for (let rotation = 0; rotation < 4; rotation++) {
        for (const { x, y } of freePlacements) {
            if (isValidPlacement(map, { x, y, pattern, rotation })) {
                placements.push({ x, y, rotation })
            }
        }
    }

    return placements
}

export function getFreePlacements(map) {
    return [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
    ]
}

export function isValidPlacement(map, { x, y, pattern, rotation }) {
    const [top, left, _, right, bottom] = getRotated({ pattern, rotation })
    
    const topTile = getTile(map, { x, y: y + 1 })
    if (topTile && topTile.pattern[4] !== top) return false
    
    const leftTile = getTile(map, { x: x - 1, y })
    if (leftTile && leftTile.pattern[3] !== left) return false

    const rightTile = getTile(map, { x: x + 1, y })
    if (rightTile && rightTile.pattern[1] !== right) return false

    const bottomTile = getTile(map, { x, y: y - 1 })
    if (bottomTile && bottomTile.pattern[0] !== bottom) return false

    return true
}

export function getTile(map, { x, y }) {
    return map.find(tile => tile.x === x && tile.y === y) || null
}
