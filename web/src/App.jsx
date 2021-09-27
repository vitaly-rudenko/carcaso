import { getPlacementsForTile, getRotated, TileFeature } from '@vitalyrudenko/carcaso-core'
import { Stage, Container, Graphics, Text } from '@inlet/react-pixi'
import React, { useState } from 'react'
import { TextStyle } from '@pixi/text'

export function App() {
    const [map, setMap] = useState([
        { x: 0, y: 0, pattern: 'crrrf', rotation: 0 },
        { x: 1, y: 1, pattern: 'frrfr', rotation: 0 },
        { x: 1, y: 0, pattern: 'frrfr', rotation: 1 },
        { x: -1, y: 0, pattern: 'frrfr', rotation: 2 },
        { x: -1, y: 1, pattern: 'frrfr', rotation: 3 },
    ])

    const [dragging, setDragging] = useState(false)
    const [hasMoved, setHasMoved] = useState(false)
    const [offset, setOffset] = useState({ x: 500, y: 500 })

    return (
        <Stage width={1000} height={1000}
            onPointerDown={() => {
                setDragging(true)
                setHasMoved(false)
            }}
            onPointerMove={(event) => {
                if (!dragging) return

                setHasMoved(true)
                setOffset({
                    x: offset.x + event.movementX,
                    y: offset.y + event.movementY,
                })
            }}
            onPointerUp={() => {
                setDragging(false)
                setHasMoved(false)
            }} >
            <Map
                map={map}
                pattern={'crrrf'}
                onSelectPlacement={(placement) => setMap([...map, { pattern: 'crrrf', ...placement }])}
                x={offset.x}
                y={offset.y}
                anchor={0.5}
                disabled={hasMoved}
            />
        </Stage>
    )
}

function Map({ map, pattern = null, disabled = false, onSelectPlacement, ...props }) {
    const possiblePlacements = pattern ? getPlacementsForTile(pattern, map) : []
    
    return <Container {...props}>
        {map.map(tile => (
            <Tile
                key={getTileKey(tile)}
                pattern={tile.pattern}
                rotation={tile.rotation}
                x={tile.x}
                y={tile.y}
            />
        ))}
        {possiblePlacements.map((placement, i) => (
            <Tile
                key={getTileKey({ pattern, ...placement })}
                label={String(i + 1)}
                preview={true}
                pattern={pattern}
                rotation={placement.rotation}
                x={placement.x}
                y={placement.y}
                pointerup={() => !disabled && onSelectPlacement(placement)}
            />
        ))}
    </Container>
}

function getTileKey({ pattern, x, y, rotation }) {
    return `${x}-${y}-${pattern}-${rotation}`
}

function Tile({ pattern, rotation, x, y, preview = false, label = null, ...props }) {
    const rotatedPattern = getRotated({ pattern, rotation })

    const tileWidth = 96
    const tileHeight = 96

    const featureWidth = tileWidth / 3
    const featureHeight = tileHeight / 3

    return <Container sortableChildren interactive buttonMode {...props}>
        {label && preview && <Text
            zIndex={2}
            text={label}
            style={new TextStyle({
                fontSize: 48,
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
