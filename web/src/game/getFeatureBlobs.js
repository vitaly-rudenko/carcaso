import { Feature, isCityFeature } from '@vitalyrudenko/carcaso-core'

export function getFeatureBlobs(matrix) {
    const blobs = []
    const checked = {}

    function isChecked(x, y) {
        return checked[x] && checked[x][y]
    }

    function check(x, y) {
        if (!checked[x]) {
            checked[x] = {}
        }

        checked[x][y] = true
    }

    function getUncheckedLocationsAround(x, y) {
        return [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ].filter(([x, y]) => x >= 0 && y >= 0 && x < 5 && y < 5 && !isChecked(x, y))
    }

    function getBlob(x, y) {
        if (isChecked(x, y)) return []
        check(x, y)

        const feature = isCityFeature(matrix[y][x]) ? Feature.CITY : matrix[y][x]
        const blob = [[x, y]]
        const uncheckedLocationsAround = getUncheckedLocationsAround(x, y)

        for (const [x, y] of uncheckedLocationsAround) {
            if (matrix[y][x] === feature || (isCityFeature(matrix[y][x]) && isCityFeature(feature))) {
                blob.push(...getBlob(x, y))
            }
        }

        return blob
    }

    for (const [y, row] of matrix.entries()) {
        for (const [x, feature] of row.entries()) {
            const blob = getBlob(x, y)
            if (blob.length > 0) {
                blobs.push({ feature, blob })
            }
        }
    }

    return blobs
}
