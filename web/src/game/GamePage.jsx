import React, { useCallback, useEffect, useRef, useState } from 'react'
import { tiles, findTilePlacements, Feature } from '@vitalyrudenko/carcaso-core'
import { Container, Stage } from '@inlet/react-pixi'
import { shuffleArray } from './utils/shuffleArray.js'
import { randomItem } from './utils/randomItem.js'
import { Map } from './Map.jsx'
import './GamePage.css'

function generateMapWithRiver() {
    const map = []

    const starterTile = tiles.find(tile => tile.pattern === 'ffwfw')
    const riverTiles = shuffleArray(tiles.filter(tile => tile.pattern.includes(Feature.RIVER) && tile.pattern !== starterTile.pattern))

    map.push({ tile: starterTile, placement: { position: { x: 0, y: 0 }, rotation: 0 } })

    for (const tile of riverTiles) {
        const placements = findTilePlacements(tile, map)
        const placement = randomItem(placements)
        if (!placement) {
            throw new Error(`Could not place ${tile.pattern} on ${JSON.stringify(map)}`)
        }

        map.push({ tile, placement })
    }

    map.push({ tile: starterTile, placement: findTilePlacements(starterTile, map)[0] })

    return map
}

function generateRandomMap(iterations = 10) {
    const map = generateMapWithRiver()

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

            const i = 0
            const tile = remainingTiles[i]
            
            let placements
            if (map.length === 0) {
                placements = [{ position: { x: 0, y: 0 }, rotation: 0 }]
            } else {
                placements = findTilePlacements(tile, map)
                    .filter(p => Math.abs(p.position.x) < 10 && Math.abs(p.position.y) < 10)
            }

            if (placements.length === 0) continue

            const placement = randomItem(placements)
            map.push({ tile, placement })
            hasAdded = true

            remainingTiles.splice(i, 1)
        }
    }

    return map
}

const initialMap = /* generateRandomMap(5) ||  */[
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i * 2, y: 0 }, rotation: 0 }
    })),
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i * 2, y: 2 }, rotation: 1 }
    })),
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i * 2, y: 4 }, rotation: 2 }
    })),
    ...tiles.map((tile, i) => ({
        tile, placement: { position: { x: i * 2, y: 6 }, rotation: 3 }
    })),
]

const tileToPlace = null // randomItem(tiles)

export function GamePage() {
    const [map, setMap] = useState(initialMap)

    const dragging = useRef(false)
    const isDisabled = useRef(false)
    const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [zoom, setZoom] = useState(100)
    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight])
    const lastClientPosition = useRef({ x: 0, y: 0 })
    const lastDistance = useRef(0)
    const isMultiTouch = useRef(false)

    const zoomIn = useCallback((increment) => {
        setZoom(Math.max(20, Math.min(zoom + increment * 10, 200)))
    }, [zoom])

    useEffect(() => {
        const listener = (event) => {
            if (event.deltaY > 0) {
                zoomIn(-1)
            } else {
                zoomIn(1)
            }
        }

        window.addEventListener('wheel', listener)
        return () => window.removeEventListener('wheel', listener)
    }, [zoomIn])

    useEffect(() => {
        const listener = () => {
            setWidthHeight([window.innerWidth, window.innerHeight])
        }

        window.addEventListener('resize', listener)
        return () => window.removeEventListener('resize', listener)
    }, [])

    const handleSelectPlacement = useCallback((placement) => {
        if (isDisabled.current) return

        const placedTile = { tile: tileToPlace, placement }
        setMap([...map, placedTile])
    }, [isDisabled, map])

    return (
        <div id="game-page" className="page">
            <Stage width={width} height={height}
                options={{ backgroundColor: 0x7f8778, resolution: 2, antialias: true }}
                onPointerDown={(event) => {
                    dragging.current = true
                    isDisabled.current = false

                    lastClientPosition.current.x = event.clientX
                    lastClientPosition.current.y = event.clientY
                }}
                onPointerMove={(event) => {
                    if (isMultiTouch.current || !dragging.current) return

                    isDisabled.current = true
                    setPosition({
                        x: Math.trunc(position.x + event.clientX - lastClientPosition.current.x),
                        y: Math.trunc(position.y + event.clientY - lastClientPosition.current.y),
                    })

                    lastClientPosition.current.x = event.clientX
                    lastClientPosition.current.y = event.clientY
                }}
                onPointerUp={() => {
                    dragging.current = false
                    isDisabled.current = false
                }}
                onTouchStart={(event) => {
                    lastDistance.current = 0
                    
                    if (event.touches.length !== 1) {
                        isMultiTouch.current = true
                        isDisabled.current = true
                    } else {
                        isMultiTouch.current = false
                    }
                }}
                onTouchMove={(event) => {
                    if (event.touches.length !== 1) {
                        isMultiTouch.current = true
                        isDisabled.current = true
                    } else {
                        isMultiTouch.current = false
                    }

                    if (event.touches.length === 2) {
                        const touch1 = event.touches.item(0)
                        const touch2 = event.touches.item(1)
                        const distance = Math.sqrt((touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2)

                        if (lastDistance.current !== 0) {
                            const last = Math.floor(lastDistance.current / 50)
                            const curr = Math.floor(distance / 50)

                            if (curr > last) {
                                zoomIn(1)
                            }

                            if (last > curr) {
                                zoomIn(-1)
                            }
                        }

                        lastDistance.current = distance
                    }
                }}
                onTouchEnd={() => {
                    lastDistance.current = 0
                    isMultiTouch.current = false
                    isDisabled.current = false
                }}
                >
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
