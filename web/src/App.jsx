import { getPlacementsForTile, getRotated, TileFeature } from '@vitalyrudenko/carcaso-core'
import { Stage, Sprite, Container, useTick, Graphics, Text } from '@inlet/react-pixi'
import React, { useEffect, useReducer, useRef } from 'react'
import { TextStyle } from '@pixi/text'

export function App() {
    const map = [
        { x: 0, y: 0, pattern: 'crrrf', rotation: 0 },
        { x: 1, y: 1, pattern: 'frrfr', rotation: 0 },
        { x: 1, y: 0, pattern: 'frrfr', rotation: 1 },
        { x: -1, y: 0, pattern: 'frrfr', rotation: 2 },
        { x: -1, y: 1, pattern: 'frrfr', rotation: 3 },
    ]

    return (
        <Stage width={1000} height={1000}>
            <Map map={map} pattern={'crrrf'} x={200} y={200} />
        </Stage>
    )
}

function Map({ map, pattern, ...props }) {
    const possiblePlacements = getPlacementsForTile(pattern, map)
    
    return <Container {...props}>
        {map.map(tile => (
            <Tile
                pattern={tile.pattern}
                rotation={tile.rotation}
                x={tile.x}
                y={tile.y}
            />
        ))}
        {possiblePlacements.map((placement, i) => (
            <Tile
                label={String(i + 1)}
                preview={true}
                pattern={pattern}
                rotation={placement.rotation}
                x={placement.x}
                y={placement.y}
            />
        ))}
    </Container>
}

function Tile({ pattern, rotation, x, y, preview = false, label = null }) {
    const rotatedPattern = getRotated({ pattern, rotation })

    const tileWidth = 96
    const tileHeight = 96

    const featureWidth = tileWidth / 3
    const featureHeight = tileHeight / 3

    return <Container sortableChildren>
        {label && preview && <Text
            zIndex={2}
            text={label}
            style={new TextStyle({
                fontSize: 64,
                fill: 0xFFFFFF,
                dropShadow: true,
            })}
            anchor={0.5}
            x={(x + 0.5) * tileWidth}
            y={-(y - 0.5) * tileWidth}
        />}
        <Graphics
            zIndex={1}
            x={x * tileWidth}
            y={-y * tileHeight}
            alpha={preview ? 0.5 : 1}
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
