import chai, { expect } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { findTilePlacements } from '../src/findTilePlacements.js'

chai.use(deepEqualInAnyOrder)

describe('findTilePlacements()', () => {
    it('should return all possible placements for empty map (non-river tile)', () => {
        expect(findTilePlacements({ pattern: 'ffmff' }, []))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 0 }, rotation: 0 },
            ])

        expect(findTilePlacements({ pattern: 'ffmfr' }, []))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 0 }, rotation: 0 },
                { position: { x: 0, y: 0 }, rotation: 1 },
                { position: { x: 0, y: 0 }, rotation: 2 },
                { position: { x: 0, y: 0 }, rotation: 3 },
            ])
    })

    it('should return all possible placements for empty map (river tile)', () => {
        expect(findTilePlacements({ pattern: 'ffwfw' }, []))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 0 }, rotation: 0 },
                { position: { x: 0, y: 0 }, rotation: 1 },
            ])
    })

    it('should return empty array for no placements', () => {
        const map = [
            { tile: { pattern: 'crccr' }, placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findTilePlacements({ pattern: 'ffmff' }, map))
            .to.deep.equalInAnyOrder([])
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

        expect(findTilePlacements({ pattern: 'wwwff' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 0 },
            ])

        expect(findTilePlacements({ pattern: 'ffwfw' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 2 },
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

        expect(findTilePlacements({ pattern: 'wwwff' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 0 }, rotation: 2 },
            ])

        expect(findTilePlacements({ pattern: 'ffwfw' }, map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 0 }, rotation: 3 },
            ])
    })
})
