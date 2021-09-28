import { rotatePattern } from './rotatePattern.js'

export function findTilePlacements(tile, map) {
    const positions = getFreeMapPositions(map)
    const placements = []

    for (let rotation = 0; rotation < 4; rotation++) {
        for (const position of positions) {
            const placement = { position, rotation }
            if (canTileBePlaced(map, tile, placement)) {
                // ignore tiles that don't change when rotated by certain angle
                if (!placements.some(p => p.position.x === position.x && p.position.y === position.y && rotatePattern(tile.pattern, p.rotation) === rotatePattern(tile.pattern, rotation))) {
                    placements.push(placement)
                }
            }
        }
    }

    return placements
}

export function getFreeMapPositions(map) {
    const positions = []

    for (const placedTile of map) {
        const { x, y } = placedTile.placement.position

        positions.push(
            ...[
                { x: x - 1, y: y + 0 },
                { x: x + 1, y: y + 0 },
                { x: x + 0, y: y - 1 },
                { x: x + 0, y: y + 1 },
            ]
                .filter(({ x, y }) => positions.every(p => p.x !== x || p.y !== y))
                .filter(({ x, y }) => !getPlacedTile(map, { x, y }))
        )
    }

    return positions
}

function canTileBePlaced(map, tile, placement) {
    const { pattern } = tile
    const { position, rotation } = placement
    const { x, y } = position

    const [top, left, _, right, bottom] = rotatePattern(pattern, rotation)
    
    const topTile = getPlacedTile(map, { x, y: y + 1 })
    if (topTile && rotatePattern(topTile.tile.pattern, topTile.placement.rotation)[4] !== top) return false
    
    const leftTile = getPlacedTile(map, { x: x - 1, y })
    if (leftTile && rotatePattern(leftTile.tile.pattern, leftTile.placement.rotation)[3] !== left) return false

    const rightTile = getPlacedTile(map, { x: x + 1, y })
    if (rightTile && rotatePattern(rightTile.tile.pattern, rightTile.placement.rotation)[1] !== right) return false

    const bottomTile = getPlacedTile(map, { x, y: y - 1 })
    if (bottomTile && rotatePattern(bottomTile.tile.pattern, bottomTile.placement.rotation)[0] !== bottom) return false

    return true
}

function getPlacedTile(map, position) {
    return map.find(tile => tile.placement.position.x === position.x && tile.placement.position.y === position.y) || null
}
