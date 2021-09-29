import chai, { expect } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { getFreeMapPositions, findTilePlacements } from '../src/findTilePlacements.js'

chai.use(deepEqualInAnyOrder)

describe('findTilePlacements()', () => {
    it('should return empty array for no placements', () => {
        const map = [
            { tile: { pattern: 'crccr' }, placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findTilePlacements({ pattern: 'ffmff' }, map))
            .to.deep.eq([])
    })

    it('should return possible placements for tiles on empty map', () => {
        const map = [
            { tile: { pattern: 'crccr' }, placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findTilePlacements({ pattern: 'crrrf' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 0  }, rotation: 0 },
                { position: { x: -1, y: 0  }, rotation: 2 },
                { position: { x: 0,  y: -1 }, rotation: 1 },
                { position: { x: 0,  y: -1 }, rotation: 3 },
                { position: { x: 1,  y: 0  }, rotation: 3 },
                { position: { x: 0,  y: 1  }, rotation: 2 },
            ])
    })

    it('should return possible placements for tiles on simple map (1)', () => {
        const map = [
            { tile: { pattern: 'crrrf' }, placement: { rotation: 0, position: { x: 0,  y: 0 } } },
            { tile: { pattern: 'crccr' }, placement: { rotation: 0, position: { x: 1,  y: 1 } } },
            { tile: { pattern: 'crccr' }, placement: { rotation: 1, position: { x: 1,  y: 0 } } },
            { tile: { pattern: 'crccr' }, placement: { rotation: 2, position: { x: -1, y: 0 } } },
            { tile: { pattern: 'crccr' }, placement: { rotation: 3, position: { x: -1, y: 1 } } },
        ]

        expect(findTilePlacements({ pattern: 'crrrf' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 2 }, rotation: 2 },
                { position: { x: 0, y: 1 }, rotation: 2 },
                { position: { x: 1, y: 2 }, rotation: 2 },
                { position: { x: 2, y: 1 }, rotation: 3 },
                { position: { x: 2, y: 0 }, rotation: 3 },
                { position: { x: 1, y: -1 }, rotation: 0 },
                { position: { x: 0, y: -1 }, rotation: 2 },
                { position: { x: -1, y: -1 }, rotation: 0 },
                { position: { x: -2, y: 0 }, rotation: 1 },
                { position: { x: -2, y: 1 }, rotation: 1 },
            ])
    })

    it('should return possible placements for tiles on simple map (2)', () => {
        const map = [
            { tile: { pattern: 'crrrf' }, placement: { rotation: 0, position: { x: 0,  y: 0 } } },
            { tile: { pattern: 'frrfr' }, placement: { rotation: 0, position: { x: 1,  y: 1 } } },
            { tile: { pattern: 'frrfr' }, placement: { rotation: 1, position: { x: 1,  y: 0 } } },
            { tile: { pattern: 'frrfr' }, placement: { rotation: 2, position: { x: -1, y: 0 } } },
            { tile: { pattern: 'frrfr' }, placement: { rotation: 3, position: { x: -1, y: 1 } } },
        ]

        expect(findTilePlacements({ pattern: 'crrrc' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 1 }, rotation: 0 },
            ])
    })

    it('should only return continuous placements for river tiles', () => {
        const map = [
            { tile: { pattern: 'ffwfw' }, placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findTilePlacements({ pattern: 'wfwfw' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 0 },
            ])
    })

    it('should return proper variations for river tiles (1)', () => {
        const map = [
            { tile: { pattern: 'ffwfw' }, placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findTilePlacements({ pattern: 'cwwwf' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 1 },
                { position: { x: 0, y: -1 }, rotation: 3 },
            ])
    })

    it('should return proper variations for river tiles (2)', () => {
        const map = [
            { tile: { pattern: 'ffwfw' }, placement: { rotation: 1, position: { x: 0, y: 0 } } }
        ]

        expect(findTilePlacements({ pattern: 'cwwwf' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 0 }, rotation: 0 },
                { position: { x: -1, y: 0 }, rotation: 2 },
            ])
    })

    it('should only allow to put river tiles in one direction', () => {
        const map = [
            { tile: { pattern: 'ffwfw' }, placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findTilePlacements({ pattern: 'wwwff' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 0 },
            ])
    })

    describe('getFreeMapPositions()', () => {
        it('should return free placements on empty map', () => {
            const map = [
                { tile: { pattern: 'crccr' }, placement: { rotation: 0, position: { x: 0, y: 0 } } }
            ]

            expect(getFreeMapPositions(map))
                .to.deep.equalInAnyOrder([
                    { x: -1, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: -1 },
                    { x: 0, y: 1 },
                ])
        })

        it('should return free placements on simple map', () => {
            const map = [
                { tile: { pattern: 'crrrf' }, placement: { rotation: 0, position: { x: 0,  y: 0 } } },
                { tile: { pattern: 'crccr' }, placement: { rotation: 0, position: { x: 1,  y: 1 } } },
                { tile: { pattern: 'crccr' }, placement: { rotation: 1, position: { x: 1,  y: 0 } } },
                { tile: { pattern: 'crccr' }, placement: { rotation: 2, position: { x: -1, y: 0 } } },
                { tile: { pattern: 'crccr' }, placement: { rotation: 3, position: { x: -1, y: 1 } } },
            ]

            expect(getFreeMapPositions(map))
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
