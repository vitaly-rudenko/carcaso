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
