import React, { useCallback, useEffect, useRef, useState } from 'react'
import { deckTiles, findPatternPlacements, Feature } from '@vitalyrudenko/carcaso-core'
import { Container, Stage } from '@inlet/react-pixi'
import { shuffleArray } from './utils/shuffleArray.js'
import { randomItem } from './utils/randomItem.js'
import { Map } from './Map.jsx'
import './GamePage.css'

function generateMapWithRiver() {
    const map = []

    const starterPattern = 'ffwfw'
    const riverPatterns = shuffleArray(
        deckTiles
            .filter(tile => tile.pattern.includes(Feature.RIVER) && tile.pattern !== starterPattern)
            .map(deckTile => deckTile.pattern)
    )

    map.push({ pattern: starterPattern, placement: { position: { x: 0, y: 0 }, rotation: 0 } })

    for (const pattern of riverPatterns) {
        const placements = findPatternPlacements(pattern, map)
        const placement = randomItem(placements)
        if (!placement) {
            throw new Error(`Could not place ${pattern} on ${JSON.stringify(map)}`)
        }

        map.push({ pattern, placement })
    }

    map.push({ pattern: starterPattern, placement: findPatternPlacements(starterPattern, map)[0] })

    return map
}

function generateRandomMap(iterations = 10) {
    const map = generateMapWithRiver()

    for (let iteration = 0; iteration < iterations; iteration++) {
        const remainingPatterns = []
        for (const deckTile of deckTiles.filter(t => !t.pattern.includes('w'))) {
            for (let i = 0; i < deckTile.count; i++) {
                remainingPatterns.push(deckTile.pattern)
            }
        }

        let hasAdded = true
        while (remainingPatterns.length > 0 && hasAdded) {
            hasAdded = false

            const i = 0
            const pattern = remainingPatterns[i]
            
            let placements
            if (map.length === 0) {
                placements = [{ position: { x: 0, y: 0 }, rotation: 0 }]
            } else {
                placements = findPatternPlacements(pattern, map)
                    .filter(p => Math.abs(p.position.x) < 10 && Math.abs(p.position.y) < 10)
            }

            if (placements.length === 0) continue

            const placement = randomItem(placements)
            map.push({ pattern, placement })
            hasAdded = true

            remainingPatterns.splice(i, 1)
        }
    }

    return map
}

const initialMap = [
    ...generateRandomMap(5),
    ...Array.from(new Array(4), (_, i) => i).flatMap(rotation => (
        deckTiles.map((deckTile, i) => ({
            pattern: deckTile.pattern,
            placement: {
                position: { x: (i % 19) - 9, y: -11 - rotation - 4 * Math.floor(i / 19) },
                rotation,
            },
        }))
    )),
]

const patternToPlace = randomItem(deckTiles).pattern

export function GamePage() {
    const [map, setMap] = useState(initialMap)

    const dragging = useRef(false)
    const isDisabled = useRef(false)
    const [position, setPosition] = useState({ zoom: 100, x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight])
    const lastClientPosition = useRef({ x: 0, y: 0 })
    const lastDistance = useRef(0)
    const isMultiTouch = useRef(false)
    const mousePosition = useRef({ x: 0, y: 0 })
    const [tileToPlaceMeeple, setTileToPlaceMeeple] = useState(null)

    const zoomIn = useCallback((increment) => {
        const oldZoom = position.zoom
        const newZoom = Math.max(20, Math.min(position.zoom + increment, 200))

        setPosition({
            zoom: newZoom,
            x: (position.x - mousePosition.current.x) * (newZoom / oldZoom) + mousePosition.current.x,
            y: (position.y - mousePosition.current.y) * (newZoom / oldZoom) + mousePosition.current.y,
        })
    }, [position])

    useEffect(() => {
        const listener = (event) => {
            if (event.deltaY > 0) {
                zoomIn(-15)
            } else {
                zoomIn(15)
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

    const handleTileSelect = useCallback((tile) => {
        if (isDisabled.current) return

        setMap([...map, tile])
        setTileToPlaceMeeple(tile)
    }, [isDisabled, map])

    const handleMeepleLocationSelect = useCallback((tile, location) => {
        if (isDisabled.current) return

        tile.meeple = {
            owner: randomItem(['red', 'green', 'blue', 'yellow', 'black']),
            location,
        }

        setMap([...map])
        setTileToPlaceMeeple(null)
    }, [map])

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
                    if (isMultiTouch.current) return

                    mousePosition.current.x = event.clientX
                    mousePosition.current.y = event.clientY

                    if (!dragging.current) return

                    isDisabled.current = true
                    setPosition({
                        zoom: position.zoom,
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
                        mousePosition.current.x = (event.touches.item(0).clientX + event.touches.item(1).clientX) / 2
                        mousePosition.current.y = (event.touches.item(0).clientY + event.touches.item(1).clientY) / 2

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
                            const last = lastDistance.current
                            const curr = distance
                            const diff = Math.floor((last - curr) / 10)

                            if (Math.abs(diff) > 0) {
                                zoomIn(-2 * diff)
                                lastDistance.current = distance
                            }
                        } else {
                            lastDistance.current = distance
                        }
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
                        zoom={position.zoom}
                        patternToPlace={patternToPlace}
                        tileToPlaceMeeple={tileToPlaceMeeple}
                        onTileSelect={handleTileSelect}
                        onMeepleLocationSelect={handleMeepleLocationSelect}
                    />
                </Container>
            </Stage>
        </div>
    )
}
