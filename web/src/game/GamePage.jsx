import React, { useCallback, useEffect, useRef, useState } from 'react'
import { tiles, findTilePlacements } from '@vitalyrudenko/carcaso-core'
import { Container, Stage } from '@inlet/react-pixi'
import { Map } from './Map.jsx'
import './GamePage.css'

function generateRandomMap(iterations = 10) {
    const map = [
        { tile: { pattern: 'ffwfw' }, placement: { rotation: 0, position: { x: 0, y: 4 } } },
        { tile: { pattern: 'fwwwf' }, placement: { rotation: 1, position: { x: 0, y: 3 } } },
        { tile: { pattern: 'fwwwf' }, placement: { rotation: 1, position: { x: 0, y: 2 } } },
        { tile: { pattern: 'fwwfw' }, placement: { rotation: 1, position: { x: 0, y: 1 } } },
        { tile: { pattern: 'cwwwc' }, placement: { rotation: 0, position: { x: -1, y: 1 } } },
        { tile: { pattern: 'fwwfw' }, placement: { rotation: 3, position: { x: -2, y: 1 } } },
        { tile: { pattern: 'fwmwf' }, placement: { rotation: 1, position: { x: -2, y: 0 } } },
        { tile: { pattern: 'cwrwr' }, placement: { rotation: 1, position: { x: -2, y: -1 } } },
        { tile: { pattern: 'rwrwr' }, placement: { rotation: 1, position: { x: -2, y: -2 } } },
        { tile: { pattern: 'rwrrw' }, placement: { rotation: 1, position: { x: -2, y: -3 } } },
        { tile: { pattern: 'fwwfw' }, placement: { rotation: 3, position: { x: -3, y: -3 } } },
        { tile: { pattern: 'ffwfw' }, placement: { rotation: 2, position: { x: -3, y: -4 } } },
    ]

    for (let iteration = 0; iteration < iterations; iteration++) {
        const remainingTiles = []
        for (const tile of tiles.filter(t => !t.pattern.includes('w'))) {
            for (let i = 0; i < tile.count; i++) {
                remainingTiles.push(tile)
            }
        }

        let hasAdded = true
        while (remainingTiles.length > 0 && hasAdded) {
            hasAdded = false
    
            for (let i = remainingTiles.length - 1; i >= 0; i--) {
                const tile = remainingTiles[i]
                
                let placements
                if (map.length === 0) {
                    placements = [{ position: { x: 0, y: 0 }, rotation: 0 }]
                } else {
                    placements = findTilePlacements(tile, map)
                        .filter(p => Math.abs(p.position.x) < 10 && Math.abs(p.position.y) < 10)
                }

                if (placements.length === 0) continue
    
                const placement = placements[Math.floor(Math.random() * placements.length)]
                map.push({ tile, placement })
                hasAdded = true
    
                remainingTiles.splice(i, 1)
            }
        }
    }

    return map
}

const initialMap = generateRandomMap(10) || [
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i, y: 0 }, rotation: 0 }
    })),
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i, y: 1 }, rotation: 1 }
    })),
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i, y: 2 }, rotation: 2 }
    })),
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i, y: 3 }, rotation: 3 }
    })),
    // edge case 1
    { tile: { pattern: 'fffff' }, placement: { position: { x: 1, y: 5 }, rotation: 0 } },
    { tile: { pattern: 'cffff' }, placement: { position: { x: 0, y: 5 }, rotation: 0 } },
    { tile: { pattern: 'fffcc' }, placement: { position: { x: 0, y: 6 }, rotation: 0 } },
    { tile: { pattern: 'fffcc' }, placement: { position: { x: 1, y: 6 }, rotation: 2 } },
    { tile: { pattern: 'ffffc' }, placement: { position: { x: 1, y: 7 }, rotation: 0 } },
    { tile: { pattern: 'fffff' }, placement: { position: { x: 0, y: 7 }, rotation: 0 } },
    // edge case 2
    { tile: { pattern: 'fffff' }, placement: { position: { x: 3, y: 5 }, rotation: 0 } },
    { tile: { pattern: 'fcfff' }, placement: { position: { x: 4, y: 5 }, rotation: 0 } },
    { tile: { pattern: 'fffcf' }, placement: { position: { x: 3, y: 6 }, rotation: 0 } },
    { tile: { pattern: 'fffff' }, placement: { position: { x: 4, y: 6 }, rotation: 0 } },
]

const tileToPlace = tiles[Math.floor(Math.random() * tiles.length)]

const ZOOMS =[
    50,
    75,
    100,
    150,
    200,
]

export function GamePage() {
    const [map, setMap] = useState(initialMap)

    const dragging = useRef(false)
    const hasMoved = useRef(false)
    const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [zoom, setZoom] = useState(100)
    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight])
    const lastClientPosition = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const listener = (event) => {
            let index = ZOOMS.indexOf(zoom) || 0

            if (event.deltaY > 0) {
                index--
            } else {
                index++
            }

            index = Math.max(0, Math.min(ZOOMS.length - 1, index))
            setZoom(ZOOMS[index])
        }

        window.addEventListener('wheel', listener)
        return () => window.removeEventListener('wheel', listener)
    }, [zoom])

    useEffect(() => {
        const listener = () => {
            setWidthHeight([window.innerWidth, window.innerHeight])
        }

        window.addEventListener('resize', listener)
        return () => window.removeEventListener('resize', listener)
    }, [])

    const handleSelectPlacement = useCallback((placement) => {
        if (hasMoved.current) return

        const placedTile = { tile: tileToPlace, placement }
        setMap([...map, placedTile])
    }, [hasMoved, map])

    return (
        <div id="game-page" className="page">
            <Stage width={width} height={height}
                options={{ backgroundColor: 0x7f8778, antialias: true, resolution: 2 }}
                onPointerDown={(event) => {
                    dragging.current = true
                    hasMoved.current = false

                    lastClientPosition.current.x = event.clientX
                    lastClientPosition.current.y = event.clientY
                }}
                onPointerMove={(event) => {
                    if (!dragging.current) return

                    hasMoved.current = true
                    setPosition({
                        x: Math.trunc(position.x + event.clientX - lastClientPosition.current.x),
                        y: Math.trunc(position.y + event.clientY - lastClientPosition.current.y),
                    })

                    lastClientPosition.current.x = event.clientX
                    lastClientPosition.current.y = event.clientY
                }}
                onPointerUp={() => {
                    dragging.current = false
                    hasMoved.current = false
                }} >
                <Container x={position.x} y={position.y} anchor={0.5}>
                    <Map
                        map={map}
                        zoom={zoom}
                        tileToPlace={tileToPlace}
                        onSelectPlacement={handleSelectPlacement}
                    />
                </Container>
            </Stage>
        </div>
    )
}
