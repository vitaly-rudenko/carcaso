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
    { pattern: 'cffcf', placement: { position: { x: -1, y: -1 }, rotation: 2 } },
    { pattern: 'wfwwf', placement: { position: { x: 0,  y: -1 }, rotation: 0 } },
    { pattern: 'rwrwr', placement: { position: { x: 1,  y: -1 }, rotation: 0 } },
    { pattern: 'fcccf', placement: { position: { x: -1, y: 0 },  rotation: 1 } },
    { pattern: 'ffmff', placement: { position: { x: 0,  y: 0 },  rotation: 0 } },
    { pattern: 'frtrr', placement: { position: { x: 1,  y: 0 },  rotation: 3 } },
    { pattern: 'cfacf', placement: { position: { x: -1, y: 1 },  rotation: 0 },
        meeple: { owner: 'red', position: { x: 4, y: 2 } } },
    { pattern: 'fcrrr', placement: { position: { x: 0,  y: 1 },  rotation: 0 } },
    { pattern: 'rrrww', placement: { position: { x: 1,  y: 1 },  rotation: 0 },
        meeple: { owner: 'green', position: { x: 1, y: 0 } } },
]

const patternToPlace = randomItem(deckTiles).pattern

export function GamePage() {
    const [map, setMap] = useState(initialMap)

    const dragging = useRef(false)
    const isPointerDown = useRef(false)
    const lastDisabledAt = useRef(Date.now())
    const [position, setPosition] = useState({ zoom: 100, x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [[width, height], setWidthHeight] = useState([window.innerWidth, window.innerHeight])
    const lastClientPosition = useRef({ x: 0, y: 0 })
    const lastMultiTouchDistance = useRef(0)
    const isMultiTouch = useRef(false)
    const mousePosition = useRef({ x: 0, y: 0 })
    const [tileToPlaceMeeple, setTileToPlaceMeeple] = useState(null)

    function isDisabled() {
        return (Date.now() - lastDisabledAt.current) < 100 || dragging.current || isMultiTouch.current
    }

    const zoomIn = useCallback((increment) => {
        const oldZoom = position.zoom
        const newZoom = Math.max(10, Math.min(position.zoom + increment, 500))

        setPosition({
            zoom: newZoom,
            x: (position.x - mousePosition.current.x) * (newZoom / oldZoom) + mousePosition.current.x,
            y: (position.y - mousePosition.current.y) * (newZoom / oldZoom) + mousePosition.current.y,
        })
    }, [position])

    useEffect(() => {
        const listener = (event) => {
            zoomIn(-event.deltaY)
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
        if (isDisabled()) return

        setMap([...map, tile])
        setTileToPlaceMeeple(tile)
    }, [map])

    const handleMeeplePositionSelect = useCallback((tile, position) => {
        if (isDisabled()) return

        tile.meeple = {
            owner: randomItem(['red', 'green', 'blue', 'yellow', 'black']),
            position,
        }

        setMap([...map])
        setTileToPlaceMeeple(null)
    }, [map])

    return (
        <div id="game-page" className="page">
            <Stage width={width} height={height}
                options={{ backgroundColor: 0x7f8778, antialias: true, autoDensity: true }}
                onPointerDown={(event) => {
                    isPointerDown.current = true
                    lastClientPosition.current.x = event.clientX
                    lastClientPosition.current.y = event.clientY
                }}
                onPointerMove={(event) => {
                    if (isMultiTouch.current) return

                    mousePosition.current.x = event.clientX
                    mousePosition.current.y = event.clientY

                    if (!isPointerDown.current) return
                    if (!dragging.current) {
                        const distance = Math.sqrt((event.clientX - lastClientPosition.current.x) ** 2 + (event.clientY - lastClientPosition.current.y) ** 2)
                        if (distance > 25) {
                            dragging.current = true
                        } else {
                            return
                        }
                    }

                    setPosition({
                        zoom: position.zoom,
                        x: Math.trunc(position.x + event.clientX - lastClientPosition.current.x),
                        y: Math.trunc(position.y + event.clientY - lastClientPosition.current.y),
                    })

                    lastClientPosition.current.x = event.clientX
                    lastClientPosition.current.y = event.clientY
                }}
                onPointerUp={() => {
                    if (dragging.current) {
                        lastDisabledAt.current = Date.now()
                    }

                    dragging.current = false
                    isPointerDown.current = false
                }}
                onTouchStart={(event) => {
                    lastMultiTouchDistance.current = 0
                    
                    if (event.touches.length !== 1) {
                        isMultiTouch.current = true
                    } else {
                        isMultiTouch.current = false
                    }
                }}
                onTouchMove={(event) => {
                    if (event.touches.length !== 1) {
                        mousePosition.current.x = (event.touches.item(0).clientX + event.touches.item(1).clientX) / 2
                        mousePosition.current.y = (event.touches.item(0).clientY + event.touches.item(1).clientY) / 2

                        isMultiTouch.current = true
                    } else {
                        isMultiTouch.current = false
                    }

                    if (event.touches.length === 2) {
                        const touch1 = event.touches.item(0)
                        const touch2 = event.touches.item(1)
                        const distance = Math.sqrt((touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2)

                        if (lastMultiTouchDistance.current !== 0) {
                            const last = lastMultiTouchDistance.current
                            const curr = distance
                            const diff = Math.floor(last - curr)

                            if (Math.abs(diff) > 0) {
                                zoomIn(-(position.zoom / 100) * diff * 0.5)
                                lastMultiTouchDistance.current = distance
                            }
                        } else {
                            lastMultiTouchDistance.current = distance
                        }
                    }
                }}
                onTouchEnd={() => {
                    if (isMultiTouch.current) {
                        lastDisabledAt.current = Date.now()
                    }

                    lastMultiTouchDistance.current = 0
                    isMultiTouch.current = false
                }}
                >
                <Container anchor={0.5} x={position.x} y={position.y} scale={position.zoom / 100}>
                    <Map
                        map={map}
                        patternToPlace={patternToPlace}
                        tileToPlaceMeeple={tileToPlaceMeeple}
                        onTileSelect={handleTileSelect}
                        onMeeplePositionSelect={handleMeeplePositionSelect}
                    />
                </Container>
            </Stage>
        </div>
    )
}
