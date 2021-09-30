import { Feature } from './Feature.js'
import { getPlaceablePositions } from './getPlaceablePositions.js'
import { getPlacedTilesAround } from './getPlacedTilesAround.js'
import { rotatePattern } from './rotatePattern.js'

export function findTilePlacements(tile, map) {
    const positions = getPlaceablePositions(map)
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

function canTileBePlaced(map, tile, placement) {
    const { pattern } = tile
    const { rotation } = placement

    const [top, left, _, right, bottom] = rotatePattern(pattern, rotation)
    const [topPlacedTile, leftPlacedTile, rightPlacedTile, bottomPlacedTile] = getPlacedTilesAround({ placement }, map)

    const topTileBottom = topPlacedTile && rotatePattern(topPlacedTile.tile.pattern, topPlacedTile.placement.rotation)[4]
    const bottomTileTop = bottomPlacedTile && rotatePattern(bottomPlacedTile.tile.pattern, bottomPlacedTile.placement.rotation)[0]
    const leftTileRight = leftPlacedTile && rotatePattern(leftPlacedTile.tile.pattern, leftPlacedTile.placement.rotation)[3]
    const rightTileLeft = rightPlacedTile && rotatePattern(rightPlacedTile.tile.pattern, rightPlacedTile.placement.rotation)[1]

    if (topPlacedTile && topTileBottom !== top) return false
    if (leftPlacedTile && leftTileRight !== left) return false
    if (rightPlacedTile && rightTileLeft !== right) return false
    if (bottomPlacedTile && bottomTileTop !== bottom) return false

    if (pattern.includes(Feature.RIVER)) {
        if (!topPlacedTile && !leftPlacedTile && !rightPlacedTile && !bottomPlacedTile) {
            if (top === Feature.RIVER || right === Feature.RIVER) return false
            return left === Feature.RIVER || bottom === Feature.RIVER
        }

        if (top === Feature.RIVER) return right !== Feature.RIVER && topTileBottom === Feature.RIVER
        if (right === Feature.RIVER) return rightTileLeft === Feature.RIVER
        
        return false
    }
    
    return true
}
