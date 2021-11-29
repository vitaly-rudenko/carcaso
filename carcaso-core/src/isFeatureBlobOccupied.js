import { getTile } from './getTile.js' 
import { getTilesAround } from './getTilesAround.js'
import { arePositionsEqual } from './arePositionsEqual.js'
import { getTileFeatureBlobs } from './getFeatureBlobs.js'

export function isFeatureBlobOccupied(map, mapPosition, tilePosition) {
    const tile = getTile(map, mapPosition)
    const blobs = getTileFeatureBlobs(map)
    const blob = blobs.find(blob => blob.positions.some(p => arePositionsEqual(p, tilePosition)))

    const [top, left, _, right, bottom] = getTilesAround(mapPosition, map)
}
