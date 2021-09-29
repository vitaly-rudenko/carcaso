import { isCityFeature } from '@vitalyrudenko/carcaso-core'
import { getVisualFeatureColor } from '../visual-features/getVisualFeatureColor.js'
import { VisualFeature } from '../visual-features/VisualFeature.js'

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
export function drawConnector(p, x, y, g, rx, ry, width, height) {
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
                width: 1.5,
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
