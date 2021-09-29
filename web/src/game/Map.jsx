import React, { useMemo } from 'react'
import deepEqual from 'fast-deep-equal/react'
import { Container } from '@inlet/react-pixi'
import { findTilePlacements } from '@vitalyrudenko/carcaso-core'
import { PlacedTile } from './PlacedTile.jsx'

const CORNERS = [
    [-1],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2, 3]
]

export const Map = React.memo(({ map, zoom, tileToPlace = null, onSelectPlacement }) => {
    const possiblePlacements = useMemo(() => tileToPlace ? findTilePlacements(tileToPlace, map) : [], [map, tileToPlace])

    const corneredPossiblePlacements = useMemo(() => {
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

        return corneredPossiblePlacements
    }, [possiblePlacements])

    return <Container>
        {map.map(placedTile => (
            <PlacedTile
                key={getPlacedTileKey(placedTile)}
                placedTile={placedTile}
                zoom={zoom}
            />
        ))}
        {corneredPossiblePlacements.map(([corner, placement]) => {
            const placedTile = { tile: tileToPlace, placement }

            return <PlacedTile preview corner={corner}
                key={getPlacedTileKey(placedTile)}
                placedTile={placedTile}
                zoom={zoom}
                onClick={() => onSelectPlacement(placement)}
            />
        })}
    </Container>
}, deepEqual)

function getPlacedTileKey({ tile: { pattern }, placement: { position: { x, y }, rotation } }) {
    return `${x}-${y}-${pattern}-${rotation}`
}
