import { Feature, isCityFeature, rotateMatrix, rotatePattern } from '@vitalyrudenko/carcaso-core'
import { VisualFeature } from './VisualFeature.js'

export function getVisualPattern(pattern) {
    const hasCoatOfArms = pattern.includes(Feature.COAT_OF_ARMS)

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
        if (rivers === 4) {
            matrix[0][2] = VisualFeature.RIVER
            matrix[1][2] = VisualFeature.RIVER
            matrix[2][2] = VisualFeature.RIVER
            matrix[3][2] = VisualFeature.RIVER
            matrix[4][2] = VisualFeature.RIVER
        } else if (rivers === 3) {
            if (top === Feature.RIVER && left === Feature.RIVER && center === Feature.RIVER && right === Feature.RIVER) {
                matrix[0][2] = VisualFeature.RIVER
                matrix[1][2] = VisualFeature.RIVER
                matrix[2][1] = VisualFeature.RIVER
                matrix[2][2] = VisualFeature.RIVER
                matrix[2][3] = VisualFeature.RIVER
            }
        } else if (rivers === 2) {
            if (top === Feature.RIVER && right === Feature.RIVER) {
                matrix[1][3] = VisualFeature.CONNECTOR
                matrix[1][2] = VisualFeature.CONNECTOR
                matrix[2][3] = VisualFeature.CONNECTOR
                
                if (matrix[2][2] === VisualFeature.RIVER) {
                    matrix[2][2] = VisualFeature.FIELD
                }
            } else if (top === Feature.RIVER && bottom === Feature.RIVER) {
                matrix[0][2] = VisualFeature.RIVER
                matrix[1][2] = VisualFeature.RIVER
            }
        } else if (rivers === 1) {
            if (top === Feature.RIVER && isCityFeature(center)) {
                matrix[1][2] = VisualFeature.RIVER
            } else if (top === Feature.RIVER && center === Feature.RIVER) {
                matrix[1][1] = VisualFeature.CONNECTOR
                matrix[2][1] = VisualFeature.RIVER
                matrix[3][1] = VisualFeature.CONNECTOR
                matrix[1][2] = VisualFeature.RIVER
                matrix[2][2] = VisualFeature.RIVER
                matrix[3][2] = VisualFeature.RIVER
                matrix[1][3] = VisualFeature.CONNECTOR
                matrix[2][3] = VisualFeature.RIVER
                matrix[3][3] = VisualFeature.CONNECTOR
            }
        }

        const roads = [...sides].filter(feature => isRoadOrTown(feature)).length
        if (roads === 4) {
            matrix[0][2] = VisualFeature.ROAD
            matrix[1][2] = VisualFeature.ROAD
            matrix[2][2] = VisualFeature.TOWN
            matrix[3][2] = VisualFeature.ROAD
            matrix[4][2] = VisualFeature.ROAD
        } else if (roads === 3) {
            if (isRoadOrTown(top) && isRoadOrTown(left) && isRoadOrTown(center) && isRoadOrTown(right)) {
                matrix[0][2] = VisualFeature.ROAD
                matrix[1][2] = VisualFeature.ROAD
                matrix[2][1] = VisualFeature.ROAD
                matrix[2][2] = VisualFeature.TOWN
                matrix[2][3] = VisualFeature.ROAD
            }
        } else if (roads === 2) {
            if (isRoadOrTown(top) && isRoadOrTown(right)) {
                matrix[1][3] = VisualFeature.CONNECTOR
                matrix[1][2] = VisualFeature.CONNECTOR
                matrix[2][3] = VisualFeature.CONNECTOR

                if (isRoadOrTown(matrix[2][2])) {
                    matrix[2][2] = VisualFeature.FIELD
                }
            } else if (isRoadOrTown(top) && isRoadOrTown(bottom)) {
                matrix[0][2] = VisualFeature.ROAD
                matrix[1][2] = VisualFeature.ROAD
                matrix[2][2] = VisualFeature.ROAD
            }
        } else if (roads === 1) {
            if (isRoadOrTown(top) && center === Feature.MONASTERY) {
                matrix[1][2] = VisualFeature.ROAD
            } else if (isRoadOrTown(top) && isRoadOrTown(center)) {
                matrix[1][2] = VisualFeature.ROAD
                matrix[2][2] = VisualFeature.ROAD
                matrix[3][2] = VisualFeature.ROAD
            }
        }

        const cityFeatures = [...rotatedPattern].filter(isCityFeature).length
        if (cityFeatures === 4) {
            if (isCityFeature(top) && isCityFeature(left) && isCityFeature(center) && isCityFeature(right)) {
                matrix[0][0] = VisualFeature.CITY
                matrix[0][1] = VisualFeature.CITY
                matrix[0][2] = VisualFeature.CITY
                matrix[0][3] = VisualFeature.CITY
                matrix[0][4] = VisualFeature.CITY
                matrix[1][0] = VisualFeature.CITY
                matrix[1][1] = VisualFeature.CITY
                matrix[1][2] = VisualFeature.CITY
                matrix[1][3] = VisualFeature.CITY
                matrix[1][4] = VisualFeature.CITY
                matrix[2][0] = VisualFeature.CITY
                matrix[2][1] = VisualFeature.CITY
                matrix[2][2] = VisualFeature.CITY
                matrix[2][3] = VisualFeature.CITY
                matrix[2][4] = VisualFeature.CITY
                matrix[3][0] = VisualFeature.CITY
                matrix[3][1] = VisualFeature.CITY
                matrix[3][2] = VisualFeature.CITY
                matrix[3][3] = VisualFeature.CITY
                matrix[3][4] = VisualFeature.CITY
                matrix[4][0] = VisualFeature.CONNECTOR
                matrix[4][4] = VisualFeature.CONNECTOR

                if (hasCoatOfArms) {
                    matrix[2][2] = VisualFeature.COAT_OF_ARMS
                }
            }
        } else if (cityFeatures === 3) {
            if (isCityFeature(top) && isCityFeature(left) && isCityFeature(center)) {
                matrix[0][0] = VisualFeature.CITY
                matrix[0][1] = VisualFeature.CITY
                matrix[0][2] = VisualFeature.CITY
                matrix[0][3] = VisualFeature.CITY
                matrix[0][4] = VisualFeature.CONNECTOR
                matrix[1][0] = VisualFeature.CITY
                matrix[1][1] = VisualFeature.CITY
                matrix[1][2] = VisualFeature.CONNECTOR
                matrix[2][0] = VisualFeature.CITY
                matrix[2][1] = VisualFeature.CONNECTOR
                matrix[2][2] = VisualFeature.FIELD
                matrix[3][0] = VisualFeature.CITY
                matrix[4][0] = VisualFeature.CONNECTOR

                if (hasCoatOfArms) {
                    matrix[1][1] = VisualFeature.COAT_OF_ARMS
                }
            } else if (isCityFeature(top) && isCityFeature(center) && isCityFeature(bottom)) {
                matrix[0][0] = VisualFeature.CONNECTOR
                matrix[0][1] = VisualFeature.CITY
                matrix[0][2] = VisualFeature.CITY
                matrix[0][3] = VisualFeature.CITY
                matrix[0][4] = VisualFeature.CONNECTOR

                matrix[1][1] = VisualFeature.CITY
                matrix[1][2] = VisualFeature.CITY
                matrix[1][3] = VisualFeature.CITY

                matrix[2][1] = VisualFeature.CITY
                matrix[2][2] = VisualFeature.CITY
                matrix[2][3] = VisualFeature.CITY
            }
        } else if (cityFeatures === 2) {
            if (isCityFeature(top) && isCityFeature(left)) {
                matrix[0][0] = VisualFeature.CONNECTOR
                matrix[0][1] = VisualFeature.CITY
                matrix[0][2] = VisualFeature.CITY
                matrix[0][3] = VisualFeature.CITY
                matrix[0][4] = VisualFeature.CONNECTOR

                matrix[1][0] = VisualFeature.CITY
                matrix[2][0] = VisualFeature.CITY
                matrix[3][0] = VisualFeature.CITY
                matrix[4][0] = VisualFeature.CONNECTOR
            } else if (isCityFeature(top) && isCityFeature(bottom)) {
                matrix[0][0] = VisualFeature.CONNECTOR
                matrix[0][1] = VisualFeature.CITY
                matrix[0][2] = VisualFeature.CITY
                matrix[0][3] = VisualFeature.CITY
                matrix[0][4] = VisualFeature.CONNECTOR

                matrix[4][1] = VisualFeature.CITY
                matrix[4][2] = VisualFeature.CITY
                matrix[4][3] = VisualFeature.CITY
            }
        } else if (cityFeatures === 1) {
            if (isCityFeature(top)) {
                matrix[0][0] = VisualFeature.CONNECTOR
                matrix[0][1] = VisualFeature.CITY
                matrix[0][2] = VisualFeature.CITY
                matrix[0][3] = VisualFeature.CITY
                matrix[0][4] = VisualFeature.CONNECTOR
            }
        }

        matrix = rotateMatrix(matrix)
    }

    return matrix
}

function isRoadOrTown(feature) {
    return feature === Feature.ROAD || feature === Feature.TOWN
}
