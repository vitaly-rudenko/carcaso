import { areFeaturesEqual } from './areFeaturesEqual.js'
import { Feature } from './Feature.js'
import { getPatternMatrix } from './getPatternMatrix.js'
import { getTile } from './getTile.js'
import { isCityFeature } from './isCityFeature.js'
import { rotatePattern } from './rotatePattern.js'

export function getFeatureBlob(globalPosition, map) {
    const { tilePosition, featurePosition } = globalToLocal(globalPosition)

    const tile = getTile(map, tilePosition)
    const matrix = getPatternMatrix(rotatePattern(tile.pattern, tile.placement.rotation))

    const checked = {}
    function getUncheckedPositionsAround(position) {
        return [
            { x: position.x - 1, y: position.y },
            { x: position.x + 1, y: position.y },
            { x: position.x, y: position.y - 1 },
            { x: position.x, y: position.y + 1 },
        ].filter(p => !checked[p.x + ':' + p.y])
    }

    let feature = matrix[featurePosition.y][featurePosition.x]
    console.log('global:', globalPosition, '=> local:', { tilePosition, featurePosition }, '=> tile: ', tile, '=> matrix:', matrix, '=> feature:', feature)
    if (isCityFeature(feature)) {
        feature = Feature.CITY
    }

    const positions = []
    const unchecked = [globalPosition]

    while (unchecked.length > 0) {
        const uncheckedPosition = unchecked.shift()
        const { x, y } = uncheckedPosition
        checked[x + ':' + y] = true
        
        const { tilePosition, featurePosition } = globalToLocal(uncheckedPosition)
        const tile = getTile(map, tilePosition)
        const matrix = getPatternMatrix(rotatePattern(tile.pattern, tile.placement.rotation))
        
        if (areFeaturesEqual(feature, matrix[featurePosition.y][featurePosition.x])) {
            positions.push(uncheckedPosition)
            unchecked.push(...getUncheckedPositionsAround(uncheckedPosition))
        }
    }

    return { feature, positions }
}

export function getFeature(globalPosition, map) {
    const { tilePosition, featurePosition } = globalToLocal(globalPosition)
    const matrix = getPatternMatrix()
}

export function globalToLocal(position) {
    const tilePosition = {
        x: Math.floor(position.x / 5),
        y: Math.floor(position.y / 5),
    }

    return {
        tilePosition,
        featurePosition: {
            x: position.x - tilePosition.x * 5,
            y: position.y - tilePosition.y * 5,
        }
    }
}
