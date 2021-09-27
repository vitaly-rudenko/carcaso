import { getRotated, TileFeature } from '@vitalyrudenko/carcaso-core'
import { Container, Graphics, Text } from '@inlet/react-pixi'
import { TextStyle } from 'pixi.js'
import React from 'react'

export function Tile({ pattern, rotation, x, y, preview = false, label = null, corner = -1, ...props }) {
    const rotatedPattern = getRotated({ pattern, rotation })

    const innerOffsetX = preview ? 4 : 0
    const innerOffsetY = preview ? 4 : 0

    const mapTileWidth = 84
    const mapTileHeight = 84

    const small = corner !== -1

    const tileWidth = small ? (mapTileWidth / 2 - innerOffsetX * 1.5) : (mapTileWidth - innerOffsetX * 2)
    const tileHeight = small ? (mapTileHeight / 2 - innerOffsetY * 1.5) : (mapTileHeight - innerOffsetY * 2)

    const featureWidth = tileWidth / 3
    const featureHeight = tileHeight / 3

    const offsetX = ((corner === 1 || corner === 3) ? tileWidth + innerOffsetX : 0) + innerOffsetX
    const offsetY = ((corner === 2 || corner === 3) ? tileHeight + innerOffsetY : 0) + innerOffsetY

    return <Container sortableChildren interactive buttonMode {...props}>
        {label && preview && <Text
            zIndex={2}
            text={label}
            style={new TextStyle({
                fontSize: small ? 18 : 24,
                fill: 0xFFFFFF,
                dropShadow: true,
                dropShadowAlpha: 0.5,
                dropShadowDistance: 2,
            })}
            anchor={0.5}
            x={x * mapTileWidth + tileWidth / 2 + offsetX}
            y={-y * mapTileHeight + tileHeight / 2 + offsetY}
        />}
        <Graphics
            zIndex={1}
            x={x * mapTileWidth + offsetX}
            y={-y * mapTileHeight + offsetY}
            alpha={preview ? 0.75 : 1}
            draw={g => {
                g.clear()

                g.beginFill(0x00FF00)
                g.drawRect(0, 0, tileWidth, tileHeight)

                // top
                const top = rotatedPattern[0]

                g.beginFill(getFeatureColor('f'))
                g.drawRect(0, 0, featureWidth, featureHeight)

                g.beginFill(getFeatureColor(top))
                g.drawRect(featureWidth, 0, featureWidth, featureHeight)

                g.beginFill(getFeatureColor('f'))
                g.drawRect(2 * featureWidth, 0, featureWidth, featureHeight)

                // middle

                const left = rotatedPattern[1]
                g.beginFill(getFeatureColor(left))
                g.drawRect(0, featureHeight, featureWidth, featureHeight)

                const center = rotatedPattern[2]
                g.beginFill(getFeatureColor(center))
                g.drawRect(featureWidth, featureHeight, featureWidth, featureHeight)

                const right = rotatedPattern[3]
                g.beginFill(getFeatureColor(right))
                g.drawRect(2 * featureWidth, featureHeight, featureWidth, featureHeight)

                // bottom
                const bottom = rotatedPattern[4]

                g.beginFill(getFeatureColor('f'))
                g.drawRect(0, 2 * featureHeight, featureWidth, featureHeight)

                g.beginFill(getFeatureColor(bottom))
                g.drawRect(featureWidth, 2 * featureHeight, featureWidth, featureHeight)

                g.beginFill(getFeatureColor('f'))
                g.drawRect(2 * featureWidth, 2 * featureHeight, featureWidth, featureHeight)
            }}
        />
    </Container>
}

function getFeatureColor(feature) {
    switch (feature) {
        case TileFeature.CITY: return 0xFF6666
        case TileFeature.COAT_OF_ARMS: return 0x0000FF
        case TileFeature.FIELD: return 0x00FF00
        case TileFeature.MONASTERY: return 0xBB0000
        case TileFeature.RIVER: return 0x6666FF
        case TileFeature.ROAD: return 0x666666
        default: throw new Error(`Invalid feature: ${feature}`)
    }
}
