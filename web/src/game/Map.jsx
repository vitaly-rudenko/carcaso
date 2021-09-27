import React from 'react'
import { Container } from '@inlet/react-pixi'
import { getPlacementsForTile } from '@vitalyrudenko/carcaso-core'
import { Tile } from './Tile.jsx'

const CORNERS = [
    [-1],
    [0, 3],
    [0, 1, 2],
    [0, 1, 2, 3]
]

export function Map({ map, pattern = null, disabled = false, onSelectPlacement, ...props }) {
    const possiblePlacements = pattern ? getPlacementsForTile(pattern, map) : []

    const groupedPlacements = {}
    for (const placement of possiblePlacements) {
        const id = placement.x + '-' + placement.y

        if (!groupedPlacements[id]) {
            groupedPlacements[id] = [placement]
        } else {
            groupedPlacements[id].push(placement)
        }
    }
    
    const corneredPossiblePlacements = []
    for (const placements of Object.values(groupedPlacements)) {
        const corners = CORNERS[placements.length - 1]
        corneredPossiblePlacements.push(...placements.map((placement, i) => [corners[i], placement]))
    }

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
        {corneredPossiblePlacements.map(([corner, placement], i) => (
            <Tile preview corner={corner}
                key={getTileKey({ pattern, ...placement })}
                label={String(i + 1)}
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
