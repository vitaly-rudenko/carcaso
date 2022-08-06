import { Feature } from './Feature.js'
import { isCityFeature } from './isCityFeature.js'
import { rotateMatrix } from './rotateMatrix.js'
import { rotatePattern } from './rotatePattern.js'

export function getPatternMatrix(pattern) {
    pattern = pattern.replace(Feature.COAT_OF_ARMS, Feature.CITY)

    const base = [...pattern].every(isCityFeature) ? Feature.CITY : Feature.FIELD
    let matrix = Array.from(new Array(5), () => new Array(5).fill(base))

    matrix[0][2] = pattern[0]
    matrix[2][0] = pattern[1]
    matrix[2][2] = pattern[2]
    matrix[2][4] = pattern[3]
    matrix[4][2] = pattern[4]

    for (let rotation = 0; rotation < 4; rotation++) {
        const rotatedPattern = rotatePattern(pattern, rotation)
        const [top, left, center, right, bottom] = rotatedPattern

        const sides = rotatedPattern[0] + rotatedPattern[1] + rotatedPattern[3] + rotatedPattern[4]

        const rivers = [...sides].filter(feature => feature === Feature.RIVER).length
        if (rivers === 2) {
            if (top === Feature.RIVER && right === Feature.RIVER) {
                matrix[0][3] = Feature.RIVER
                matrix[1][3] = Feature.RIVER
                matrix[1][4] = Feature.RIVER

                if (matrix[2][2] === Feature.RIVER) {
                    matrix[2][2] = Feature.FIELD
                }
            } else if (top === Feature.RIVER && bottom === Feature.RIVER) {
                matrix[0][2] = Feature.RIVER
                matrix[1][2] = Feature.RIVER
            }
        } else if (rivers === 1) {
            if (top === Feature.RIVER && isCityFeature(center)) {
                matrix[1][2] = Feature.RIVER
            } else if (top === Feature.RIVER && center === Feature.RIVER) {
                matrix[1][1] = Feature.RIVER
                matrix[1][2] = Feature.RIVER
                matrix[1][3] = Feature.RIVER
                matrix[2][1] = Feature.RIVER
                matrix[2][2] = Feature.RIVER
                matrix[2][3] = Feature.RIVER
                matrix[3][1] = Feature.RIVER
                matrix[3][2] = Feature.RIVER
                matrix[3][3] = Feature.RIVER
            }
        }

        const roads = [...sides].filter(feature => isRoadOrTown(feature)).length
        if (roads === 4) {
            matrix[0][2] = Feature.ROAD
            matrix[1][2] = Feature.ROAD
            matrix[2][2] = Feature.TOWN
            matrix[3][2] = Feature.ROAD
            matrix[4][2] = Feature.ROAD
        } else if (roads === 3) {
            if (isRoadOrTown(top) && isRoadOrTown(left) && isRoadOrTown(center) && isRoadOrTown(right)) {
                matrix[0][2] = Feature.ROAD
                matrix[1][2] = Feature.ROAD
                matrix[2][1] = Feature.ROAD
                matrix[2][2] = Feature.TOWN
                matrix[2][3] = Feature.ROAD
            }
        } else if (roads === 2) {
            if (isRoadOrTown(top) && isRoadOrTown(right)) {
                matrix[0][3] = Feature.ROAD
                matrix[1][3] = Feature.ROAD
                matrix[1][4] = Feature.ROAD

                if (isRoadOrTown(matrix[2][2])) {
                    matrix[2][2] = Feature.FIELD
                }
            } else if (isRoadOrTown(top) && isRoadOrTown(bottom)) {
                matrix[0][2] = Feature.ROAD
                matrix[1][2] = Feature.ROAD
                matrix[2][2] = Feature.ROAD
            }
        } else if (roads === 1) {
            if (isRoadOrTown(top) && center === Feature.MONASTERY) {
                matrix[1][2] = Feature.ROAD
            } else if (isRoadOrTown(top) && isRoadOrTown(center)) {
                matrix[1][2] = Feature.ROAD
                matrix[2][2] = Feature.ROAD
                matrix[3][2] = Feature.ROAD
            }
        }

        const cityFeatures = [...rotatedPattern].filter(isCityFeature).length
        if (cityFeatures === 4) {
            if (isCityFeature(top) && isCityFeature(left) && isCityFeature(center) && isCityFeature(right)) {
                matrix[0][0] = Feature.CITY
                matrix[0][1] = Feature.CITY
                matrix[0][2] = Feature.CITY
                matrix[0][3] = Feature.CITY
                matrix[0][4] = Feature.CITY
                matrix[1][0] = Feature.CITY
                matrix[1][1] = Feature.CITY
                matrix[1][2] = Feature.CITY
                matrix[1][3] = Feature.CITY
                matrix[1][4] = Feature.CITY
                matrix[2][0] = Feature.CITY
                matrix[2][1] = Feature.CITY
                matrix[2][2] = Feature.CITY
                matrix[2][3] = Feature.CITY
                matrix[2][4] = Feature.CITY
                matrix[3][0] = Feature.CITY
                matrix[3][1] = Feature.CITY
                matrix[3][2] = Feature.CITY
                matrix[3][3] = Feature.CITY
                matrix[3][4] = Feature.CITY
                matrix[4][0] = Feature.BORDER
                matrix[4][4] = Feature.BORDER
            }
        } else if (cityFeatures === 3) {
            if (isCityFeature(top) && isCityFeature(left) && isCityFeature(center)) {
                matrix[0][0] = Feature.CITY
                matrix[0][1] = Feature.CITY
                matrix[0][2] = Feature.CITY
                matrix[0][3] = Feature.CITY
                matrix[0][4] = Feature.BORDER
                matrix[1][0] = Feature.CITY
                matrix[1][1] = Feature.CITY
                matrix[1][2] = Feature.CITY
                matrix[2][0] = Feature.CITY
                matrix[2][1] = Feature.CITY
                matrix[2][2] = Feature.FIELD
                matrix[3][0] = Feature.CITY
                matrix[4][0] = Feature.BORDER
            } else if (isCityFeature(top) && isCityFeature(center) && isCityFeature(bottom)) {
                matrix[0][0] = Feature.BORDER
                matrix[0][1] = Feature.CITY
                matrix[0][2] = Feature.CITY
                matrix[0][3] = Feature.CITY
                matrix[0][4] = Feature.BORDER

                matrix[1][1] = Feature.CITY
                matrix[1][2] = Feature.CITY
                matrix[1][3] = Feature.CITY

                matrix[2][1] = Feature.CITY
                matrix[2][2] = Feature.CITY
                matrix[2][3] = Feature.CITY
            }
        } else if (cityFeatures === 2) {
            if (isCityFeature(top) && isCityFeature(left)) {
                matrix[0][0] = Feature.BORDER
                matrix[0][1] = Feature.CITY
                matrix[0][2] = Feature.CITY
                matrix[0][3] = Feature.CITY
                matrix[0][4] = Feature.BORDER

                matrix[1][0] = Feature.CITY
                matrix[2][0] = Feature.CITY
                matrix[3][0] = Feature.CITY
                matrix[4][0] = Feature.BORDER
            } else if (isCityFeature(top) && isCityFeature(bottom)) {
                matrix[0][0] = Feature.BORDER
                matrix[0][1] = Feature.CITY
                matrix[0][2] = Feature.CITY
                matrix[0][3] = Feature.CITY
                matrix[0][4] = Feature.BORDER

                matrix[4][1] = Feature.CITY
                matrix[4][2] = Feature.CITY
                matrix[4][3] = Feature.CITY
            }
        } else if (cityFeatures === 1) {
            if (isCityFeature(top)) {
                matrix[0][0] = Feature.BORDER
                matrix[0][1] = Feature.CITY
                matrix[0][2] = Feature.CITY
                matrix[0][3] = Feature.CITY
                matrix[0][4] = Feature.BORDER
            }
        }

        matrix = rotateMatrix(matrix)
    }

    if (matrix[2][2] === Feature.MONASTERY) {
        matrix[1][1] = Feature.MONASTERY
        matrix[1][2] = Feature.MONASTERY
        matrix[1][3] = Feature.MONASTERY
        matrix[2][1] = Feature.MONASTERY
        matrix[2][2] = Feature.MONASTERY
        matrix[2][3] = Feature.MONASTERY
        matrix[3][1] = Feature.MONASTERY
        matrix[3][2] = Feature.MONASTERY
        matrix[3][3] = Feature.MONASTERY
    }

    return matrix
}

function isRoadOrTown(feature) {
    return feature === Feature.ROAD || feature === Feature.TOWN
}
