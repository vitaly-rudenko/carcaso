import React, { useCallback, useRef } from 'react'
import deepEqual from 'fast-deep-equal/react'
import { rotatePattern, Feature, getPatternMatrix } from '@vitalyrudenko/carcaso-core'
import { Container, Graphics } from '@inlet/react-pixi'
import { VisualFeature } from './visual-features/VisualFeature.js'
import { getVisualPattern } from './visual-features/getVisualPattern.js'
import { getVisualFeatureColor } from './visual-features/getVisualFeatureColor.js'
import { drawCoatOfArms } from './graphics/drawCoatOfArms.js'
import { drawMonastery } from './graphics/drawMonastery.js'
import { drawConnector } from './graphics/drawConnector.js'
import { drawTown } from './graphics/drawTown.js'
import { getFeatureBlobs } from './getFeatureBlobs.js'

export const PreviewType = {
    TILE: 'tile',
    MEEPLE: 'meeple',
}

export const Tile = React.memo(({
    tile,
    zoom = 100,
    previewType = null,
    corner = -1,
    onTileSelect,
    onMeepleSelect,
}) => {
    const scale = zoom / 100

    const { x, y } = tile.placement.position

    const rotatedPattern = rotatePattern(tile.pattern, tile.placement.rotation)

    const innerOffsetX = (previewType === PreviewType.TILE ? 3 : 0) * scale
    const innerOffsetY = (previewType === PreviewType.TILE ? 3 : 0) * scale

    const mapTileWidth = 48 * scale
    const mapTileHeight = 48 * scale

    const small = corner !== -1

    const tileWidth = small ? (mapTileWidth / 2 - innerOffsetX * 1.5) : (mapTileWidth - innerOffsetX * 2)
    const tileHeight = small ? (mapTileHeight / 2 - innerOffsetY * 1.5) : (mapTileHeight - innerOffsetY * 2)

    const featureWidth = tileWidth / 5
    const featureHeight = tileHeight / 5

    const offsetX = ((corner === 1 || corner === 2) ? tileWidth + innerOffsetX : 0) + innerOffsetX
    const offsetY = ((corner === 1 || corner === 3) ? tileHeight + innerOffsetY : 0) + innerOffsetY

    const graphics = useRef(null)

    const onClick = useCallback((event) => {
        if (previewType === PreviewType.TILE && onTileSelect) {
            onTileSelect()
        }

        if (previewType === PreviewType.MEEPLE && onMeepleSelect) {
            const local = graphics.current.toLocal(event.data.global)

            onMeepleSelect({
                x: Math.floor(local.x / featureWidth),
                y: Math.floor(local.y / featureHeight),
            })
        }
    }, [previewType, onTileSelect, onMeepleSelect, featureWidth, featureHeight])

    return <Container sortableChildren interactive={previewType} buttonMode={previewType} pointerup={onClick}>
        <Graphics
            zIndex={1}
            ref={graphics}
            x={x * mapTileWidth + offsetX}
            y={-y * mapTileHeight + offsetY}
            alpha={previewType === PreviewType.TILE ? 0.75 : 1}
            draw={g => {
                g.clear()

                g.beginFill(getVisualFeatureColor(Feature.FIELD))
                g.drawRect(0, 0, tileWidth, tileHeight)
                g.endFill()

                const visualPattern = getVisualPattern(rotatedPattern)

                // regular
                for (const [y, row] of visualPattern.entries()) {
                    for (const [x, feature] of row.entries()) {
                        if (
                            feature === VisualFeature.FIELD ||
                            feature === VisualFeature.COAT_OF_ARMS ||
                            feature === VisualFeature.MONASTERY ||
                            feature === VisualFeature.TOWN
                        ) continue

                        if (feature === VisualFeature.CONNECTOR) {
                            drawConnector(visualPattern, x, y, g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        } else {
                            g.beginFill(getVisualFeatureColor(feature))
                            g.drawRect(x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                            g.endFill()
                        }
                    }
                }

                // special
                for (const [y, row] of visualPattern.entries()) {
                    for (const [x, feature] of row.entries()) {
                        if (feature === VisualFeature.COAT_OF_ARMS) {
                            drawCoatOfArms(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        } else if (feature === VisualFeature.MONASTERY) {
                            drawMonastery(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        } else if (feature === VisualFeature.TOWN) {
                            drawTown(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        }
                    }
                }

                // meeple
                if (previewType === PreviewType.MEEPLE) {
                    const matrix = getPatternMatrix(rotatePattern(tile.pattern, tile.placement.rotation))
                    for (const [y, row] of matrix.entries()) {
                        for (const [x, feature] of row.entries()) {
                            if (feature === Feature.BORDER) {
                                continue
                            }
    
                            g.beginFill(getVisualFeatureColor(feature))
                            g.drawRect(x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                            g.endFill()
                        }
                    }
    
                    const blobs = getFeatureBlobs(matrix)
                    for (const { feature, blob } of blobs) {
                        if (![Feature.CITY, Feature.MONASTERY, Feature.ROAD, Feature.FIELD].includes(feature)) {
                            continue
                        }
    
                        const centerX = blob.reduce((sum, b) => sum + b[0], 0) / blob.length
                        const centerY = blob.reduce((sum, b) => sum + b[1], 0) / blob.length
    
                        let [x, y] = [centerX, centerY]
                        if (matrix[Math.round(y)]?.[Math.round(x)] !== feature) {
                            const distances = blob
                                .map(([x, y], i) => [i, Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2)])
                                .sort((a, b) => a[1] - b[1])
        
                            ;([x, y] = blob[distances[0][0]])
                        }
    
                        g.beginFill(0x000000, 0.5)
                        g.drawCircle(x * featureWidth + featureWidth / 2, y * featureHeight + featureHeight / 2, featureWidth / 3)
                        g.endFill()
                    }
                }

                // grid
                if (!previewType) {
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
