import { Feature } from './Feature.js'
import { getPlaceablePositions } from './getPlaceablePositions.js'
import { getTilesAround } from './getTilesAround.js'
import { rotatePattern } from './rotatePattern.js'

/**
 * Find all possible placements of a pattern on a map.
 * 
 * @param {string} pattern Compact 5x1 string pattern like "ffmff"
 * @param {import('./types').Map} map 
 * @returns {import('./types').Placement[]}
 */
export function findPatternPlacements(pattern, map) {
    const positions = getPlaceablePositions(map)
    const placements = []

    for (let rotation = 0; rotation < 4; rotation++) {
        for (const position of positions) {
            const placement = { position, rotation }
            if (canPatternBePlaced(pattern, placement, map)) {
                // ignore tiles that don't change when rotated by certain angle
                if (!placements.some(p => p.position.x === position.x && p.position.y === position.y && rotatePattern(pattern, p.rotation) === rotatePattern(pattern, rotation))) {
                    placements.push(placement)
                }
            }
        }
    }

    return placements
}

/**
 * Check if pattern can be placed in a specified placement.
 * 
 * @param {string} pattern
 * @param {import('./types').Placement} placement
 * @param {import('./types').Map} map
 * @returns {boolean}
 */
function canPatternBePlaced(pattern, placement, map) {
    const [top, left, _, right, bottom] = rotatePattern(pattern, placement.rotation)
    const [topTile, leftTile, rightTile, bottomTile] = getTilesAround(placement.position, map)

    const topTileBottom = topTile && rotatePattern(topTile.pattern, topTile.placement.rotation)[4]
    const bottomTileTop = bottomTile && rotatePattern(bottomTile.pattern, bottomTile.placement.rotation)[0]
    const leftTileRight = leftTile && rotatePattern(leftTile.pattern, leftTile.placement.rotation)[3]
    const rightTileLeft = rightTile && rotatePattern(rightTile.pattern, rightTile.placement.rotation)[1]

    if (topTile && topTileBottom !== top) return false
    if (leftTile && leftTileRight !== left) return false
    if (rightTile && rightTileLeft !== right) return false
    if (bottomTile && bottomTileTop !== bottom) return false

    if (pattern.includes(Feature.RIVER)) {
        if (!topTile && !leftTile && !rightTile && !bottomTile) {
            if (top === Feature.RIVER || right === Feature.RIVER) return false
            return left === Feature.RIVER || bottom === Feature.RIVER
        }

        if (top === Feature.RIVER) return right !== Feature.RIVER && topTileBottom === Feature.RIVER
        if (right === Feature.RIVER) return rightTileLeft === Feature.RIVER
        
        return false
    }
    
    return true
}
