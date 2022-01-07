import { getTile } from './getTile.js' 
import { getFeatureBlob } from './getFeatureBlob.js'
import { globalToLocal } from './globalToLocal.js'
import { getPatternMatrix } from './getPatternMatrix.js'

export function isFeatureBlobOccupied(globalPosition, map) {
    const blob = getFeatureBlob(globalPosition, map)

    return blob.positions.some(position => {
        const { tilePosition, featurePosition } = globalToLocal(position)
        const tile = getTile(map, tilePosition)
        const matrix = getPatternMatrix(tile.pattern)

        if (!tile.meeple) return false

        const meepleFeature = matrix[tile.meeple.position.y][tile.meeple.position.x]
        const blobPositionFeature = matrix[featurePosition.y][featurePosition.x]

        if (meepleFeature !== blobPositionFeature) return false

        return true
    })
}