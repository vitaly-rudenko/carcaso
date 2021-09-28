import React from 'react'
import { Container } from '@inlet/react-pixi'
import { findTilePlacements } from '@vitalyrudenko/carcaso-core'
import { PlacedTile } from './PlacedTile.jsx'

const CORNERS = [
    [-1],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2, 3]
]

export function Map({ map, tileToPlace = null, disabled = false, onSelectPlacement, ...props }) {
    const possiblePlacements = tileToPlace ? findTilePlacements(tileToPlace, map) : []

    const groupedPlacements = {}
    for (const placement of possiblePlacements) {
        const id = placement.position.x + '-' + placement.position.y

        if (!groupedPlacements[id]) {
            groupedPlacements[id] = [placement]
        } else {
            groupedPlacements[id].push(placement)
        }
    }
    
    const corneredPossiblePlacements = []
    for (const placements of Object.values(groupedPlacements)) {
        const corners = CORNERS[placements.filter(Boolean).length - 1]
        corneredPossiblePlacements.push(...placements.map((placement, i) => [corners[i], placement]))
    }

    return <Container {...props}>
        {map.map(placedTile => (
            <PlacedTile
                key={getPlacedTileKey(placedTile)}
                placedTile={placedTile}
            />
        ))}
        {corneredPossiblePlacements.map(([corner, placement], i) => {
            const placedTile = { tile: tileToPlace, placement }

            return <PlacedTile preview corner={corner}
                key={getPlacedTileKey(placedTile)}
                label={String(i + 1)}
                placedTile={placedTile}
                pointerup={() => !disabled && onSelectPlacement(placement)}
            />
        })}
    </Container>
}

function getPlacedTileKey({ tile: { pattern }, placement: { position: { x, y }, rotation } }) {
    return `${x}-${y}-${pattern}-${rotation}`
}
