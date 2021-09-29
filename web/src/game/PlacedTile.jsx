import React from 'react'
import deepEqual from 'fast-deep-equal/react'
import { rotatePattern, Feature } from '@vitalyrudenko/carcaso-core'
import { Container, Graphics } from '@inlet/react-pixi'

export const PlacedTile = React.memo(({ placedTile, zoom = 100, preview = false, corner = -1, onClick }) => {
    const scale = zoom / 100

    const { x, y } = placedTile.placement.position

    const rotatedPattern = rotatePattern(placedTile.tile.pattern, placedTile.placement.rotation)

    const innerOffsetX = (preview ? 2 : 0) * scale
    const innerOffsetY = (preview ? 2 : 0) * scale

    const mapTileWidth = 48 * scale
    const mapTileHeight = 48 * scale

    const small = corner !== -1

    const tileWidth = small ? (mapTileWidth / 2 - innerOffsetX * 1.5) : (mapTileWidth - innerOffsetX * 2)
    const tileHeight = small ? (mapTileHeight / 2 - innerOffsetY * 1.5) : (mapTileHeight - innerOffsetY * 2)

    const featureWidth = tileWidth / 5
    const featureHeight = tileHeight / 5

    const offsetX = ((corner === 1 || corner === 2) ? tileWidth + innerOffsetX : 0) + innerOffsetX
    const offsetY = ((corner === 1 || corner === 3) ? tileHeight + innerOffsetY : 0) + innerOffsetY

    return <Container sortableChildren interactive={preview} buttonMode={preview} pointerup={onClick}>
        <Graphics
            zIndex={1}
            x={x * mapTileWidth + offsetX}
            y={-y * mapTileHeight + offsetY}
            alpha={preview ? scale : 1}
            draw={g => {
                g.clear()

                g.beginFill(getVisualFeatureColor(Feature.FIELD))
                g.drawRect(0, 0, tileWidth, tileHeight)
                g.endFill()

                const visualPattern = getVisualPattern(rotatedPattern)

                // regular
                for (const [y, row] of visualPattern.entries()) {
                    for (const [x, feature] of row.entries()) {
                        if (feature === VisualFeature.FIELD) continue
                        if (feature === VisualFeature.COAT_OF_ARMS || feature === VisualFeature.MONASTERY) continue
                        if (feature === VisualFeature.CONNECTOR) {
                            drawConnector(visualPattern, x, y, g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                            continue
                        }

                        g.beginFill(getVisualFeatureColor(feature))
                        g.drawRect(x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        g.endFill()
                    }
                }

                // special
                for (const [y, row] of visualPattern.entries()) {
                    for (const [x, feature] of row.entries()) {
                        if (feature === VisualFeature.COAT_OF_ARMS) {
                            drawCoatOfArms(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        } else if (feature === VisualFeature.MONASTERY) {
                            drawMonastery(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        }
                    }
                }

                if (preview) {
                    g.beginFill(0x000000, scale * 0.25)
                    g.drawRect(-1, -1, tileWidth + 2, tileHeight + 2)
                    g.endFill()

                    g.beginHole()
                    g.drawRect(0, 0, tileWidth, tileHeight)
                    g.endHole()
                } else {
                    g.beginFill(0x000000, scale * 0.1)
                    g.drawRect(0, 0, tileWidth, tileHeight)
                    g.endFill()

                    g.beginHole()
                    g.drawRect(1, 1, tileWidth - 1, tileHeight - 1)
                    g.endHole()
                }
            }}
        />
    </Container>
}, deepEqual)

const VisualFeature = {
    ...Feature,
    CONNECTOR: 'connector',
}

const ConnectorType = {
    FULL: 'full',
    LINE_LEFT_RIGHT: 'lineLeftRight',
    LINE_RIGHT_LEFT: 'lineRightLeft',
    TOP_LEFT: 'topLeft',
    TOP_RIGHT: 'topRight',
    BOTTOM_LEFT: 'bottomLeft',
    BOTTOM_RIGHT: 'bottomRight',
}

const visualFeaturePriorities = [VisualFeature.CITY, VisualFeature.COAT_OF_ARMS, VisualFeature.ROAD, VisualFeature.RIVER]

/** @param {import('pixi.js').Graphics} g */
function drawConnector(p, x, y, g, rx, ry, width, height) {
    let type = ConnectorType.FULL

    const top = y > 0 && p[y - 1][x]
    const bottom = y < 4 && p[y + 1][x]
    const left = x > 0 && p[y][x - 1]
    const right = x < 4 && p[y][x + 1]
    
    const topLeft = y > 0 && x > 0 && p[y - 1][x - 1]
    const topRight = y > 0 && x < 4 && p[y - 1][x + 1]
    const bottomLeft = y < 4 && x > 0 && p[y + 1][x - 1]
    const bottomRight = y < 4 && x < 4 && p[y + 1][x + 1]

    const adjacentAround = [top, bottom, left, right].filter(feature => feature && visualFeaturePriorities.includes(feature))
    const around = [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight].filter(feature => feature && visualFeaturePriorities.includes(feature))
    const feature = around.sort((a, b) => visualFeaturePriorities.indexOf(a) - visualFeaturePriorities.indexOf(b))[0]
    const adjacentCount = adjacentAround.filter(f => (isCityFeature(feature) ? isCityFeature(f) : f === feature) || f === VisualFeature.CONNECTOR).length

    if (isCityFeature(feature)) {
        if (adjacentCount === 2) {
            if (isCityFeature(top) && isCityFeature(left) && (right && !isCityFeature(right))) {
                type = ConnectorType.TOP_LEFT
            }

            if (isCityFeature(top) && isCityFeature(right) && (left && !isCityFeature(left))) {
                type = ConnectorType.TOP_RIGHT
            }

            if (isCityFeature(bottom) && isCityFeature(left) && (right && !isCityFeature(right))) {
                type = ConnectorType.BOTTOM_LEFT
            }

            if (isCityFeature(bottom) && isCityFeature(right) && (left && !isCityFeature(left))) {
                type = ConnectorType.BOTTOM_RIGHT
            }

            if (
                (isCityFeature(left) && isCityFeature(bottom) && !top && !right) ||
                (isCityFeature(top) && isCityFeature(right) && !bottom && !left)
            ) {
                type = ConnectorType.LINE_RIGHT_LEFT
            }

            if (
                (isCityFeature(right) && isCityFeature(bottom) && !top && !left) ||
                (isCityFeature(top) && isCityFeature(left) && !bottom && !right)
            ) {
                type = ConnectorType.LINE_LEFT_RIGHT
            }
        }

        if (adjacentCount === 1) {
            if (isCityFeature(top)) {
                if (!left) {
                    type = ConnectorType.TOP_LEFT
                } else {
                    type = ConnectorType.TOP_RIGHT
                }
            }

            if (isCityFeature(bottom)) {
                if (!left) {
                    type = ConnectorType.BOTTOM_LEFT
                } else {
                    type = ConnectorType.BOTTOM_RIGHT
                }
            }

            if (isCityFeature(left)) {
                if (!top) {
                    type = ConnectorType.TOP_LEFT
                } else {
                    type = ConnectorType.BOTTOM_LEFT
                }
            }

            if (isCityFeature(right)) {
                if (!top) {
                    type = ConnectorType.TOP_RIGHT
                } else {
                    type = ConnectorType.BOTTOM_RIGHT
                }
            }
        }
    } else {
        if (adjacentCount === 0) {
            if (top === VisualFeature.CONNECTOR) {
                if (left === VisualFeature.CONNECTOR) {
                    type = ConnectorType.TOP_LEFT
                } else {
                    type = ConnectorType.TOP_RIGHT
                }
            }

            if (bottom === VisualFeature.CONNECTOR) {
                if (left === VisualFeature.CONNECTOR) {
                    type = ConnectorType.BOTTOM_LEFT
                } else {
                    type = ConnectorType.BOTTOM_RIGHT
                }
            }
        }

        if (adjacentCount === 1) {
            if (right === feature) {
                if (bottom === VisualFeature.CONNECTOR) {
                    type = ConnectorType.BOTTOM_RIGHT
                } else {
                    type = ConnectorType.TOP_RIGHT
                }
            }

            if (left === feature) {
                if (bottom === VisualFeature.CONNECTOR) {
                    type = ConnectorType.BOTTOM_LEFT
                } else {
                    type = ConnectorType.TOP_LEFT
                }
            }

            if (top === feature) {
                if (left === VisualFeature.CONNECTOR) {
                    type = ConnectorType.TOP_LEFT
                } else {
                    type = ConnectorType.TOP_RIGHT
                }
            }

            if (bottom === feature) {
                if (left === VisualFeature.CONNECTOR) {
                    type = ConnectorType.BOTTOM_LEFT
                } else {
                    type = ConnectorType.BOTTOM_RIGHT
                }
            }
        }

        if (adjacentCount === 2) {
            if (top === feature) {
                if (left === feature) {
                    type = ConnectorType.TOP_LEFT
                } else {
                    type = ConnectorType.TOP_RIGHT
                }
            }

            if (bottom === feature) {
                if (left === feature) {
                    type = ConnectorType.BOTTOM_LEFT
                } else {
                    type = ConnectorType.BOTTOM_RIGHT
                }
            }
        }
    }

    g.beginFill(
        isCityFeature(feature)
            ? (
                type === ConnectorType.FULL
                    ? getVisualFeatureColor(VisualFeature.CONNECTOR)
                    : getVisualFeatureColor(VisualFeature.CITY)
            )
            : getVisualFeatureColor(feature)
    )

    switch (type) {
        case ConnectorType.FULL:
            g.drawRect(rx, ry, width, height)
            break
        case ConnectorType.TOP_LEFT:
            g.drawPolygon([
                rx, ry,
                rx + width, ry,
                rx, ry + height,
            ])
            break
        case ConnectorType.TOP_RIGHT:
            g.drawPolygon([
                rx, ry,
                rx + width, ry,
                rx + width, ry + height,
            ])
            break
        case ConnectorType.BOTTOM_LEFT:
            g.drawPolygon([
                rx, ry,
                rx, ry + height,
                rx + width, ry + height,
            ])
            break
        case ConnectorType.BOTTOM_RIGHT:
            g.drawPolygon([
                rx + width, ry,
                rx, ry + height,
                rx + width, ry + height,
            ])
            break
        case ConnectorType.LINE_RIGHT_LEFT:
        case ConnectorType.LINE_LEFT_RIGHT:
            g.drawRect(rx, ry, width, height)
            g.endFill()

            g.lineStyle({
                width: 1,
                color: 0x000000,
                alpha: 0.5,
            })

            if (type === ConnectorType.LINE_RIGHT_LEFT) {
                g.moveTo(rx + width, ry)
                g.lineTo(rx, ry + height)
            } else {
                g.moveTo(rx, ry)
                g.lineTo(rx + width, ry + height)
            }
            
            g.lineStyle()
            break
        default: throw new Error(`Invalid connector type: ${type}`)
    }

    g.endFill()
}

function drawCoatOfArms(g, x, y, width, height) {
    g.beginFill(getVisualFeatureColor(Feature.CITY))
    g.drawRect(x, y, width, height)
    g.endFill()

    g.beginFill(getVisualFeatureColor(Feature.COAT_OF_ARMS))
    g.drawPolygon([
        x, y - 2 + - height * 0.2,
        x, y - 2 + height,
        x + width * 0.5, y - 2 + height * 1.5,
        x + width, y - 2 + height,
        x + width, y - 2 - height * 0.2,
    ])
    g.endFill()
}

function drawMonastery(g, x, y, width, height) {
    g.beginFill(getVisualFeatureColor(Feature.FIELD))
    g.drawRect(x, y, width, height)
    g.endFill()

    g.beginFill(getVisualFeatureColor(Feature.MONASTERY))
    g.drawPolygon([
        x - width * 0.5, y - height * 0.2,
        x - width * 0.5, y + height * 1.2,
        x + width + width * 0.5, y + height * 1.2,
        x + width + width * 0.5, y - height * 0.2,
        x + width * 0.5, y - height * 0.8,
    ])
    g.endFill()
}

function getVisualPattern(pattern) {
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
                matrix[2][2] = VisualFeature.RIVER
                matrix[2][2] = VisualFeature.RIVER
                matrix[2][2] = VisualFeature.RIVER
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

        const roads = [...sides].filter(feature => feature === Feature.ROAD).length
        if (roads === 4) {
            matrix[0][2] = VisualFeature.ROAD
            matrix[1][2] = VisualFeature.ROAD
            matrix[2][2] = VisualFeature.ROAD
            matrix[3][2] = VisualFeature.ROAD
            matrix[4][2] = VisualFeature.ROAD
        } else if (roads === 3) {
            if (top === Feature.ROAD && left === Feature.ROAD && center === Feature.ROAD && right === Feature.ROAD) {
                matrix[0][2] = VisualFeature.ROAD
                matrix[1][2] = VisualFeature.ROAD
                matrix[2][1] = VisualFeature.ROAD
                matrix[2][2] = VisualFeature.ROAD
                matrix[2][3] = VisualFeature.ROAD
            }
        } else if (roads === 2) {
            if (top === Feature.ROAD && right === Feature.ROAD) {
                matrix[1][3] = VisualFeature.CONNECTOR
                matrix[1][2] = VisualFeature.CONNECTOR
                matrix[2][3] = VisualFeature.CONNECTOR

                if (matrix[2][2] === VisualFeature.ROAD) {
                    matrix[2][2] = VisualFeature.FIELD
                }
            } else if (top === Feature.ROAD && bottom === Feature.ROAD) {
                matrix[0][2] = VisualFeature.ROAD
                matrix[1][2] = VisualFeature.ROAD
                matrix[2][2] = VisualFeature.ROAD
                matrix[2][2] = VisualFeature.ROAD
                matrix[2][2] = VisualFeature.ROAD
            }
        } else if (roads === 1) {
            if (top === Feature.ROAD && center === Feature.MONASTERY) {
                matrix[1][2] = VisualFeature.ROAD
            } else if (top === Feature.ROAD && center === Feature.ROAD) {
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

    if (matrix[2][2] === VisualFeature.RIVER && pattern[2] === Feature.ROAD) {
        matrix[2][2] = VisualFeature.ROAD
    }

    return matrix
}

function rotateMatrix(matrix) {
    const width = matrix[0].length
    const height = matrix.length
    const result = Array.from(new Array(width), () => new Array(height).fill())

    for (const [i, row] of matrix.entries()) {
        for (const [j, item] of row.entries()) {
            result[j][height - i - 1] = item
        }
    }

    return result
}

function isCityFeature(feature) {
    return feature === Feature.CITY || feature === Feature.COAT_OF_ARMS
}

function getVisualFeatureColor(feature) {
    switch (feature) {
        case VisualFeature.CONNECTOR: return 0x9e9990
        case VisualFeature.CITY: return 0xd9be68
        case VisualFeature.COAT_OF_ARMS: return 0x565B96
        case VisualFeature.FIELD: return 0x7BB93D
        case VisualFeature.MONASTERY: return 0xD16547
        case VisualFeature.RIVER: return 0xaacfe3
        case VisualFeature.ROAD: return 0xEDF6E8
        default: throw new Error(`Invalid visual feature: ${feature}`)
    }
}
