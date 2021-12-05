import { areFeaturesEqual } from './areFeaturesEqual.js'
import { Feature } from './Feature.js'
import { getPatternMatrix } from './getPatternMatrix.js'
import { getTile } from './getTile.js'
import { globalToLocal } from './globalToLocal.js'
import { isCityFeature } from './isCityFeature.js'
import { rotatePattern } from './rotatePattern.js'

export function getFeatureBlob(globalPosition, map) {
    const { tilePosition, featurePosition } = globalToLocal(globalPosition)

    const tile = getTile(map, tilePosition)
    const matrix = getPatternMatrix(rotatePattern(tile.pattern, tile.placement.rotation))

    const checked = {}
    function getPositionsAround(position) {
        return [
            { x: position.x - 1, y: position.y },
            { x: position.x + 1, y: position.y },
            { x: position.x, y: position.y - 1 },
            { x: position.x, y: position.y + 1 },
        ]
    }

    let feature = matrix[featurePosition.y][featurePosition.x]
    if (isCityFeature(feature)) {
        feature = Feature.CITY
    }

    const positions = []
    const unchecked = [globalPosition]

    while (unchecked.length > 0) {
        const uncheckedPosition = unchecked.shift()
        const { x, y } = uncheckedPosition

        if (checked[x + ':' + y]) continue
        checked[x + ':' + y] = true
        
        const { tilePosition, featurePosition } = globalToLocal(uncheckedPosition)
        const tile = getTile(map, tilePosition)
        if (!tile) continue

        const matrix = getPatternMatrix(rotatePattern(tile.pattern, tile.placement.rotation))
        
        if (areFeaturesEqual(feature, matrix[featurePosition.y][featurePosition.x])) {
            positions.push(uncheckedPosition)
            unchecked.push(...getPositionsAround(uncheckedPosition))
        }
    }

    return { feature, positions }
}
