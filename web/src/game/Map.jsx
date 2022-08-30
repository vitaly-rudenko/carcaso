import React, { useMemo } from 'react'
import deepEqual from 'fast-deep-equal/react'
import { Container } from '@inlet/react-pixi'
import { findPatternPlacements } from '@vitalyrudenko/carcaso-core'
import { PreviewType, Tile } from './Tile.jsx'
import { DEBUG_MEEPLE } from '../tools/debug.js'

export const Map = React.memo(({ map, patternToPlace = null, tileToPlaceMeeple = null, onTileSelect, onMeeplePositionSelect }) => {
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
        {[...map].sort((a, b) => a.placement.position.y - b.placement.position.y).map(tile => (
            <Tile
                key={getTileKey(tile)}
                previewType={
                    DEBUG_MEEPLE ?
                    (!tile.meeple && PreviewType.MEEPLE) :
                    (tileToPlaceMeeple === tile ? PreviewType.MEEPLE : null)
                }
                tile={tile}
                onMeeplePositionSelect={onMeeplePositionSelect}
            />
        ))}
        {corneredPossiblePlacements.map(([corner, placement]) => {
            const tile = { pattern: patternToPlace, placement }
            return <Tile
                key={getTileKey(tile)}
                previewType={PreviewType.TILE}
                corner={corner}
                tile={tile}
                onTileSelect={onTileSelect}
            />
        })}
    </Container>
}, deepEqual)

function getTileKey({ pattern, placement: { position: { x, y }, rotation } }) {
    return `${x}-${y}-${pattern}-${rotation}`
}
