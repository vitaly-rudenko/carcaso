import React, { useState } from 'react'
import { Stage } from '@inlet/react-pixi'
import { Map } from './Map.jsx'

export function GamePage() {
    const tileToPlace = { pattern: 'ffrrr' }
    // const tileToPlace = null

    const [map, setMap] = useState([
        { tile: { pattern: 'crrrf' }, placement: { rotation: 0, position: { x: 0,  y: 0 } } },
        { tile: { pattern: 'frrfr' }, placement: { rotation: 0, position: { x: 1,  y: 1 } } },
        { tile: { pattern: 'frrfr' }, placement: { rotation: 1, position: { x: 1,  y: 0 } } },
        { tile: { pattern: 'frrfr' }, placement: { rotation: 2, position: { x: -1, y: 0 } } },
        { tile: { pattern: 'frrfr' }, placement: { rotation: 3, position: { x: -1, y: 1 } } },
    ])

    const [dragging, setDragging] = useState(false)
    const [hasMoved, setHasMoved] = useState(false)
    const [position, setPosition] = useState({ x: 500, y: 500 })
    const [lastSelectedTile, setLastSelectedTile] = useState(null)

    return (
        <div id="game-page" className="page">
            <Stage width={1000} height={1000}
                options={{ backgroundColor: 0xFFFFFF }}
                onPointerDown={() => {
                    setDragging(true)
                    setHasMoved(false)
                }}
                onPointerMove={(event) => {
                    if (!dragging) return

                    setHasMoved(true)
                    setPosition({
                        x: position.x + event.movementX,
                        y: position.y + event.movementY,
                    })
                }}
                onPointerUp={() => {
                    setDragging(false)
                    setHasMoved(false)
                }} >
                <Map
                    map={map}
                    tileToPlace={tileToPlace}
                    selectedTileForMeeple={lastSelectedTile}
                    onSelectPlacement={(placement) => {
                        const tile = { tile: tileToPlace, placement }
                        setMap([...map, tile])
                        setLastSelectedTile(tile)
                    }}
                    onSelectPlacementForMeeple={(placement) => {
                        setMap([
                            ...map.filter(tile => !areTilesEqual(tile, lastSelectedTile)),
                            { ...lastSelectedTile, meeple: { owner: 'red', placement } }
                        ])
                    }}
                    x={position.x}
                    y={position.y}
                    anchor={0.5}
                    disabled={hasMoved}
                />
            </Stage>
        </div>
    )
}

function areTilesEqual(tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y && tile1.rotation === tile2.rotation && tile1.pattern === tile2.pattern
}
