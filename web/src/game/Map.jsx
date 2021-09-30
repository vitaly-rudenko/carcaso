import React, { useMemo } from 'react'
import deepEqual from 'fast-deep-equal/react'
import { Container } from '@inlet/react-pixi'
import { findPatternPlacements } from '@vitalyrudenko/carcaso-core'
import { PreviewType, Tile } from './Tile.jsx'

export const Map = React.memo(({ map, zoom, patternToPlace = null, tileToPlaceMeeple = null, onSelectTilePlacement, onSelectMeepleLocation }) => {
    const possiblePlacements = useMemo(() => patternToPlace ? findPatternPlacements(patternToPlace, map) : [], [map, patternToPlace])

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
            corneredPossiblePlacements.push(...placements.map((placement, i) => [placements.length > 1 ? i : -1, placement]))
        }

        return corneredPossiblePlacements
    }, [possiblePlacements])

    return <Container>
        {map.map(tile => (
            <Tile
                key={getTileKey(tile)}
                // previewType={tileToPlaceMeeple === tile ? PreviewType.MEEPLE : null}
                previewType={PreviewType.MEEPLE}
                tile={tile}
                zoom={zoom}
                onMeepleSelect={(location) => onSelectMeepleLocation(location)}
            />
        ))}
        {corneredPossiblePlacements.map(([corner, placement]) => {
            const tile = { pattern: patternToPlace, placement }
            return <Tile
                key={getTileKey(tile)}
                previewType={PreviewType.TILE}
                corner={corner}
                tile={tile}
                zoom={zoom}
                onTileSelect={() => onSelectTilePlacement(placement)}
            />
        })}
    </Container>
}, deepEqual)

function getTileKey({ pattern, placement: { position: { x, y }, rotation } }) {
    return `${x}-${y}-${pattern}-${rotation}`
}
