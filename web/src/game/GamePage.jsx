import React, { useState } from 'react'
import { Stage } from '@inlet/react-pixi'
import { Map } from './Map.jsx'

export function GamePage() {
    const [map, setMap] = useState([
        { x: 0, y: 0, pattern: 'crrrf', rotation: 0 },
        { x: 1, y: 1, pattern: 'frrfr', rotation: 0 },
        { x: 1, y: 0, pattern: 'frrfr', rotation: 1 },
        { x: -1, y: 0, pattern: 'frrfr', rotation: 2 },
        { x: -1, y: 1, pattern: 'frrfr', rotation: 3 },
    ])

    const [dragging, setDragging] = useState(false)
    const [hasMoved, setHasMoved] = useState(false)
    const [position, setPosition] = useState({ x: 500, y: 500 })

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
                    pattern={'rrrfr'}
                    onSelectPlacement={(placement) => setMap([...map, { pattern: 'rrrfr', ...placement }])}
                    x={position.x}
                    y={position.y}
                    anchor={0.5}
                    disabled={hasMoved}
                />
            </Stage>
        </div>
    )
}
