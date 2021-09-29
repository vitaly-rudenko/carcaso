import { Feature } from './Feature.js'
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
    if (map.length === 0) {
        return [{ x: 0, y: 0 }]
    }

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
    const topPlacedTile = getPlacedTile(map, { x, y: y + 1 })
    const leftPlacedTile = getPlacedTile(map, { x: x - 1, y })
    const rightPlacedTile = getPlacedTile(map, { x: x + 1, y })
    const bottomPlacedTile = getPlacedTile(map, { x, y: y - 1 })

    const topTileBottom = topPlacedTile && rotatePattern(topPlacedTile.tile.pattern, topPlacedTile.placement.rotation)[4]
    const bottomTileTop = bottomPlacedTile && rotatePattern(bottomPlacedTile.tile.pattern, bottomPlacedTile.placement.rotation)[0]
    const leftTileRight = leftPlacedTile && rotatePattern(leftPlacedTile.tile.pattern, leftPlacedTile.placement.rotation)[3]
    const rightTileLeft = rightPlacedTile && rotatePattern(rightPlacedTile.tile.pattern, rightPlacedTile.placement.rotation)[1]

    if (topPlacedTile && topTileBottom !== top) return false
    if (leftPlacedTile && leftTileRight !== left) return false
    if (rightPlacedTile && rightTileLeft !== right) return false
    if (bottomPlacedTile && bottomTileTop !== bottom) return false

    if (pattern.includes(Feature.RIVER)) {
        if (!topPlacedTile && !rightPlacedTile) {
            if (top === Feature.RIVER || right === Feature.RIVER) return false
            return left === Feature.RIVER || bottom === Feature.RIVER
        }

        if (top === Feature.RIVER) return right !== Feature.RIVER && topTileBottom === Feature.RIVER
        if (right === Feature.RIVER) return rightTileLeft === Feature.RIVER
        
        return false
    }
    
    return true
}

function getPlacedTile(map, position) {
    return map.find(tile => tile.placement.position.x === position.x && tile.placement.position.y === position.y) || null
}
