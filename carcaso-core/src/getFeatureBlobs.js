import { areFeaturesEqual } from './areFeaturesEqual.js'
import { Feature } from './Feature.js'
import { isCityFeature } from './isCityFeature.js'

export function getTileFeatureBlobs(matrix) {
    const blobs = []
    const checked = []

    function isChecked(x, y) {
        return checked[x] && checked[x][y]
    }

    function check(x, y) {
        if (!checked[x]) {
            checked[x] = []
        }

        checked[x][y] = true
    }

    function getUncheckedPositionsAround({ x, y }) {
        return [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ].filter(([x, y]) => x >= 0 && y >= 0 && x < 5 && y < 5 && !isChecked(x, y))
    }

    function getBlobPositions(x, y) {
        if (isChecked(x, y)) return []
        check(x, y)

        const feature = isCityFeature(matrix[y][x]) ? Feature.CITY : matrix[y][x]
        const blob = [{ x, y }]
        const uncheckedPositionsAround = getUncheckedPositionsAround({ x, y })

        for (const [x, y] of uncheckedPositionsAround) {
            if (areFeaturesEqual(matrix[y][x], feature)) {
                blob.push(...getBlobPositions(x, y))
            }
        }

        return blob
    }

    for (const [y, row] of matrix.entries()) {
        for (const [x, feature] of row.entries()) {
            const positions = getBlobPositions(x, y)
            if (positions.length > 0) {
                blobs.push({ feature, positions })
            }
        }
    }

    return blobs
}
