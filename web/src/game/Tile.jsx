import React, { useCallback, useRef } from 'react'
import deepEqual from 'fast-deep-equal/react'
import { Container, Graphics } from '@inlet/react-pixi'
import { rotatePattern, Feature, getPatternMatrix, getFeatureBlobs, getMatrixItemsAround, isMeeplePlaceableFeature } from '@vitalyrudenko/carcaso-core'
import { VisualFeature } from './visual-features/VisualFeature.js'
import { getVisualPattern } from './visual-features/getVisualPattern.js'
import { getVisualFeatureColor } from './visual-features/getVisualFeatureColor.js'
import { drawCoatOfArms } from './graphics/drawCoatOfArms.js'
import { drawMonastery } from './graphics/drawMonastery.js'
import { drawConnector } from './graphics/drawConnector.js'
import { drawTown } from './graphics/drawTown.js'
import { drawMeeple } from './graphics/drawMeeple.js'

export const PreviewType = {
    TILE: 'tile',
    MEEPLE: 'meeple',
}

export const Tile = React.memo(({
    tile,
    previewType = null,
    corner = -1,
    onTileSelect,
    onMeeplePositionSelect,
}) => {
    const { x, y } = tile.placement.position

    const rotatedPattern = rotatePattern(tile.pattern, tile.placement.rotation)
    const visualPattern = getVisualPattern(rotatedPattern)
    const matrix = getPatternMatrix(rotatedPattern)

    const innerOffsetX = (previewType === PreviewType.TILE ? 3 : 0)
    const innerOffsetY = (previewType === PreviewType.TILE ? 3 : 0)

    const mapTileWidth = 48
    const mapTileHeight = 48

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

        if (previewType === PreviewType.MEEPLE && onMeeplePositionSelect) {
            const local = graphics.current.toLocal(event.data.global)
            const x = Math.floor(local.x / featureWidth)
            const y = Math.floor(local.y / featureHeight)
            const position = { x, y }

            if (isValidMeepleLocation(position, matrix, visualPattern, matrix[y][x])) {
                onMeeplePositionSelect(tile, position)
            }
        }
    }, [tile, previewType, onTileSelect, onMeeplePositionSelect, featureWidth, featureHeight, matrix, visualPattern])

    return <Container sortableChildren interactive={previewType} buttonMode={previewType} pointerup={onClick}>
        <Graphics
            zIndex={1}
            ref={graphics}
            x={x * mapTileWidth + offsetX}
            y={-y * mapTileHeight + offsetY}
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
                    g.beginFill(0x000000, 0.1)
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
                    const { owner, position } = tile.meeple
                    const { x, y } = getVisualMeepleLocation(matrix, position.x, position.y, visualPattern)
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
    const blob = blobs.find(blob => blob.positions.some(p => p.x === x && p.y === y))

    return getFeatureBlobMeepleLocation(blob, matrix, visualPattern)
}

function getFeatureBlobMeepleLocation(blob, matrix, visualPattern) {
    const { positions, feature } = blob
    const validPositions = positions
        .filter(position => isValidMeepleLocation(position, matrix, visualPattern, feature))
        .sort((a, b) => b.y - a.y)

    if (validPositions.length === 0) return null

    const centerX = validPositions.reduce((sum, p) => sum + p.x, 0) / validPositions.length
    const centerY = validPositions.reduce((sum, p) => sum + p.y, 0) / validPositions.length
    const centerLocation = { x: centerX, y: centerY }

    if (!isValidMeepleLocation(centerLocation, matrix, visualPattern, feature)) {
        const distances = validPositions
            .map((p, i) => ({ index: i, distance: Math.sqrt((centerX - p.x) ** 2 + (centerY - p.y) ** 2) }))
            .sort((a, b) => a.distance - b.distance)

        return validPositions[(distances[0]).index]
    }

    return centerLocation
}

function isValidMeepleLocation(location, matrix, visualPattern, feature) {
    if (!isMeeplePlaceableFeature(feature)) return false
    const { x, y } = location

    const px = Math.round(x)
    const py = Math.round(y)

    return matrix[py]?.[px] === feature
        && visualPattern[py]?.[px] === feature
        && getMatrixItemsAround(visualPattern, { x: px, y: py })
            .every(f => f !== Feature.TOWN && f !== Feature.COAT_OF_ARMS)
}

