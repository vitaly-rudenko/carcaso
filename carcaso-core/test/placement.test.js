import chai, { expect } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { getFreeMapPlacements, getPlacementsForTile } from '../src/placement.js'

chai.use(deepEqualInAnyOrder)

describe('[placement]', () => {
    describe('getPlacementsForTile()', () => {
        it('should return empty array for no placements', () => {
            const map = [{ x: 0, y: 0, pattern: 'crccr', rotation: 0 }]
    
            expect(getPlacementsForTile('ffmff', map))
                .to.deep.eq([])
        })

        it('should return possible placements for tiles on empty map', () => {
            const map = [{ x: 0, y: 0, pattern: 'crccr', rotation: 0 }]
    
            expect(getPlacementsForTile('crrrf', map))
                .to.deep.equalInAnyOrder([
                    { x: -1, y: 0,  rotation: 0 },
                    { x: -1, y: 0,  rotation: 2 },
                    { x: 0,  y: -1, rotation: 1 },
                    { x: 0,  y: -1, rotation: 3 },
                    { x: 1,  y: 0,  rotation: 3 },
                    { x: 0,  y: 1,  rotation: 2 },
                ])
        })

        it('should return possible placements for tiles on simple map (1)', () => {
            const map = [
                { x: 0,  y: 0, pattern: 'crrrf', rotation: 0 },
                { x: 1,  y: 1, pattern: 'crccr', rotation: 0 },
                { x: 1,  y: 0, pattern: 'crccr', rotation: 1 },
                { x: -1, y: 0, pattern: 'crccr', rotation: 2 },
                { x: -1, y: 1, pattern: 'crccr', rotation: 3 },
            ]

            expect(getPlacementsForTile('crrrf', map))
                .to.deep.equalInAnyOrder([
                    { x: -1, y: 2, rotation: 2 },
                    { x: 0, y: 1, rotation: 2 },
                    { x: 1, y: 2, rotation: 2 },
                    { x: 2, y: 1, rotation: 3 },
                    { x: 2, y: 0, rotation: 3 },
                    { x: 1, y: -1, rotation: 0 },
                    { x: 0, y: -1, rotation: 2 },
                    { x: -1, y: -1, rotation: 0 },
                    { x: -2, y: 0, rotation: 1 },
                    { x: -2, y: 1, rotation: 1 },
                ])
        })

        it('should return possible placements for tiles on simple map (2)', () => {
            const map = [
                { x: 0,  y: 0, pattern: 'crrrf', rotation: 0 },
                { x: 1,  y: 1, pattern: 'frrfr', rotation: 0 },
                { x: 1,  y: 0, pattern: 'frrfr', rotation: 1 },
                { x: -1, y: 0, pattern: 'frrfr', rotation: 2 },
                { x: -1, y: 1, pattern: 'frrfr', rotation: 3 },
            ]

            expect(getPlacementsForTile('crrrc', map))
                .to.deep.equalInAnyOrder([
                    { x: 0, y: 1, rotation: 0 },
                ])
        })
    })

    describe('getFreeMapPlacements()', () => {
        it('should return free placements on empty map', () => {
            const map = [{ x: 0, y: 0, pattern: 'crccr', rotation: 0 }]

            expect(getFreeMapPlacements(map))
                .to.deep.equalInAnyOrder([
                    { x: -1, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: -1 },
                    { x: 0, y: 1 },
                ])
        })

        it('should return free placements on simple map', () => {
            const map = [
                { x: 0,  y: 0, pattern: 'crrrf', rotation: 0 },
                { x: 1,  y: 1, pattern: 'crccr', rotation: 0 },
                { x: 1,  y: 0, pattern: 'crccr', rotation: 1 },
                { x: -1, y: 0, pattern: 'crccr', rotation: 2 },
                { x: -1, y: 1, pattern: 'crccr', rotation: 3 },
            ]

            expect(getFreeMapPlacements(map))
                .to.deep.equalInAnyOrder([
                    { x: -1, y: 2 },
                    { x: -2, y: 1 },
                    { x: -2, y: 0 },
                    { x: -1, y: -1 },
                    { x: 0, y: -1 },
                    { x: 1, y: -1 },
                    { x: 2, y: 0 },
                    { x: 2, y: 1 },
                    { x: 1, y: 2 },
                    { x: 0, y: 1 },
                ])
        })
    })
})
