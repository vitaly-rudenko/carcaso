import React from 'react'
import deepEqual from 'fast-deep-equal/react'
import { rotatePattern, Feature } from '@vitalyrudenko/carcaso-core'
import { Container, Graphics } from '@inlet/react-pixi'
import { VisualFeature } from './visual-features/VisualFeature.js'
import { getVisualPattern } from './visual-features/getVisualPattern.js'
import { getVisualFeatureColor } from './visual-features/getVisualFeatureColor.js'
import { drawCoatOfArms } from './graphics/drawCoatOfArms.js'
import { drawMonastery } from './graphics/drawMonastery.js'
import { drawConnector } from './graphics/drawConnector.js'
import { drawTown } from './graphics/drawTown.js'

export const Tile = React.memo(({
    tile,
    zoom = 100,
    preview = false,
    corner = -1,
    onSelect,
}) => {
    const scale = zoom / 100

    const { x, y } = tile.placement.position

    const rotatedPattern = rotatePattern(tile.pattern, tile.placement.rotation)

    const innerOffsetX = (preview ? 3 : 0) * scale
    const innerOffsetY = (preview ? 3 : 0) * scale

    const mapTileWidth = 48 * scale
    const mapTileHeight = 48 * scale

    const small = corner !== -1

    const tileWidth = small ? (mapTileWidth / 2 - innerOffsetX * 1.5) : (mapTileWidth - innerOffsetX * 2)
    const tileHeight = small ? (mapTileHeight / 2 - innerOffsetY * 1.5) : (mapTileHeight - innerOffsetY * 2)

    const featureWidth = tileWidth / 5
    const featureHeight = tileHeight / 5

    const offsetX = ((corner === 1 || corner === 2) ? tileWidth + innerOffsetX : 0) + innerOffsetX
    const offsetY = ((corner === 1 || corner === 3) ? tileHeight + innerOffsetY : 0) + innerOffsetY

    return <Container sortableChildren interactive={preview} buttonMode={preview} pointerup={onSelect}>
        <Graphics
            zIndex={1}
            x={x * mapTileWidth + offsetX}
            y={-y * mapTileHeight + offsetY}
            alpha={preview ? 0.75 : 1}
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
                            feature === VisualFeature.TOWN ||
                            feature === VisualFeature.CONNECTOR
                        ) continue

                        g.beginFill(getVisualFeatureColor(feature))
                        g.drawRect(x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        g.endFill()
                    }
                }

                // special
                for (const [y, row] of visualPattern.entries()) {
                    for (const [x, feature] of row.entries()) {
                        if (feature === VisualFeature.CONNECTOR) {
                            drawConnector(visualPattern, x, y, g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        } else if (feature === VisualFeature.COAT_OF_ARMS) {
                            drawCoatOfArms(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        } else if (feature === VisualFeature.MONASTERY) {
                            drawMonastery(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        } else if (feature === VisualFeature.TOWN) {
                            drawTown(g, x * featureWidth, y * featureHeight, featureWidth, featureHeight)
                        }
                    }
                }

                if (!preview) {
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
