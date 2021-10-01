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
import { drawMeeple } from './graphics/drawMeeple.js'

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
    onMeepleLocationSelect,
}) => {
    const scale = zoom / 100

    const { x, y } = tile.placement.position

    const rotatedPattern = rotatePattern(tile.pattern, tile.placement.rotation)
    const visualPattern = getVisualPattern(rotatedPattern)
    const matrix = getPatternMatrix(rotatedPattern)

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
            onTileSelect(tile)
        }

        if (previewType === PreviewType.MEEPLE && onMeepleLocationSelect) {
            const local = graphics.current.toLocal(event.data.global)
            const x = Math.floor(local.x / featureWidth)
            const y = Math.floor(local.y / featureHeight)

            if (isValidMeepleLocation(matrix, visualPattern, x, y, matrix[y][x])) {
                onMeepleLocationSelect(tile, { x, y })
            }
        }
    }, [tile, previewType, onTileSelect, onMeepleLocationSelect, featureWidth, featureHeight, matrix, visualPattern])

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

                // grid
                if (previewType !== PreviewType.TILE) {
                    g.beginFill(0x000000, scale * 0.1)
                    g.drawRect(0, 0, tileWidth, tileHeight)
                    g.endFill()

                    g.beginHole()
                    g.drawRect(1, 1, tileWidth - 1, tileHeight - 1)
                    g.endHole()
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
                if (tile.meeple) {
                    const { owner, location } = tile.meeple
                    const { x, y } = getVisualMeepleLocation(matrix, location.x, location.y, visualPattern)
                    drawMeeple(owner, g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                }

                // meeple preview
                if (previewType === PreviewType.MEEPLE) {
                    for (const [y, row] of matrix.entries()) {
                        for (const [x, feature] of row.entries()) {
                            g.beginFill(getVisualFeatureColor(feature), 0)
                            g.drawRect(x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                            g.endFill()
                        }
                    }
    
                    const meepleLocations = getVisualMeepleLocations(matrix, visualPattern)
                    for (const { x, y } of meepleLocations) {
                        drawMeeple(null, g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                    }
                }
            }}
        />
    </Container>
}, deepEqual)

function getVisualMeepleLocations(matrix, visualPattern) {
    const locations = []
    
    const blobs = getFeatureBlobs(matrix)
    for (const blob of blobs) {
        const location = getFeatureBlobMeepleLocation(blob, matrix, visualPattern)
        if (location) {
            locations.push(location)
        }
    }

    return locations
}

function getVisualMeepleLocation(matrix, x, y, visualPattern) {
    const blobs = getFeatureBlobs(matrix)
    const blob = blobs.find(blob => blob.blob.some(([bx, by]) => bx === x && by === y))

    return getFeatureBlobMeepleLocation(blob, matrix, visualPattern)
}

function getFeatureBlobMeepleLocation({ blob, feature }, matrix, visualPattern) {
    const filteredBlob = blob.filter(([x, y]) => isValidMeepleLocation(matrix, visualPattern, x, y, feature)).sort((a, b) => b[1] - a[1])
    if (filteredBlob.length === 0) return null

    const centerX = filteredBlob.reduce((sum, b) => sum + b[0], 0) / filteredBlob.length
    const centerY = filteredBlob.reduce((sum, b) => sum + b[1], 0) / filteredBlob.length

    let [x, y] = [centerX, centerY]
    if (!isValidMeepleLocation(matrix, visualPattern, x, y, feature)) {
        const distances = filteredBlob
            .map(([x, y], i) => [i, Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2)])
            .sort((a, b) => a[1] - b[1])

        ;([x, y] = filteredBlob[(distances[0])[0]])
    }

    return { x, y }
}

function isValidMeepleLocation(matrix, visualPattern, x, y, feature) {
    if (!isValidMeepleFeature(feature)) return false

    const px = Math.round(x)
    const py = Math.round(y)

    return matrix[py]?.[px] === feature
        && visualPattern[py]?.[px] === feature
        && getItemsAround(visualPattern, px, py)
            .every(f => f !== Feature.TOWN && f !== Feature.COAT_OF_ARMS)
}

function isValidMeepleFeature(feature) {
    return [Feature.CITY, Feature.MONASTERY, Feature.ROAD, Feature.FIELD].includes(feature)
}

function getItemsAround(matrix, x, y) {
    return [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
    ]
        .filter(([x, y]) => y >= 0 && y < matrix.length && x >= 0 && x < matrix[y].length)
        .map(([x, y]) => matrix[y][x])
}
