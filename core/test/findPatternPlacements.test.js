import './setup.js'
import { expect } from 'chai'
import { findPatternPlacements } from '../src/findPatternPlacements.js'

describe('findPatternPlacements()', () => {
    it('should return all possible placements for empty map (non-river tile)', () => {
        expect(findPatternPlacements('ffmff', []))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 0 }, rotation: 0 },
            ])

        expect(findPatternPlacements('ffmfr', []))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 0 }, rotation: 0 },
                { position: { x: 0, y: 0 }, rotation: 1 },
                { position: { x: 0, y: 0 }, rotation: 2 },
                { position: { x: 0, y: 0 }, rotation: 3 },
            ])
    })

    it('should return all possible placements for empty map (river tile)', () => {
        expect(findPatternPlacements('ffwfw', []))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 0 }, rotation: 0 },
                { position: { x: 0, y: 0 }, rotation: 1 },
            ])
    })

    it('should return empty array for no placements', () => {
        const map = [
            { pattern: 'crccr', placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findPatternPlacements('ffmff', map))
            .to.deep.equalInAnyOrder([])
    })

    it('should return possible placements for tiles on empty map', () => {
        const map = [
            { pattern: 'crccr', placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findPatternPlacements('crrrf', map))
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
            { pattern: 'crrrf', placement: { rotation: 0, position: { x: 0,  y: 0 } } },
            { pattern: 'crccr', placement: { rotation: 0, position: { x: 1,  y: 1 } } },
            { pattern: 'crccr', placement: { rotation: 1, position: { x: 1,  y: 0 } } },
            { pattern: 'crccr', placement: { rotation: 2, position: { x: -1, y: 0 } } },
            { pattern: 'crccr', placement: { rotation: 3, position: { x: -1, y: 1 } } },
        ]

        expect(findPatternPlacements('crrrf', map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 2 },  rotation: 2 },
                { position: { x: 0, y: 1 },   rotation: 2 },
                { position: { x: 1, y: 2 },   rotation: 2 },
                { position: { x: 2, y: 1 },   rotation: 3 },
                { position: { x: 2, y: 0 },   rotation: 3 },
                { position: { x: 1, y: -1 },  rotation: 0 },
                { position: { x: 0, y: -1 },  rotation: 2 },
                { position: { x: -1, y: -1 }, rotation: 0 },
                { position: { x: -2, y: 0 },  rotation: 1 },
                { position: { x: -2, y: 1 },  rotation: 1 },
            ])
    })

    it('should return possible placements for tiles on simple map (2)', () => {
        const map = [
            { pattern: 'crrrf', placement: { rotation: 0, position: { x: 0,  y: 0 } } },
            { pattern: 'frrfr', placement: { rotation: 0, position: { x: 1,  y: 1 } } },
            { pattern: 'frrfr', placement: { rotation: 1, position: { x: 1,  y: 0 } } },
            { pattern: 'frrfr', placement: { rotation: 2, position: { x: -1, y: 0 } } },
            { pattern: 'frrfr', placement: { rotation: 3, position: { x: -1, y: 1 } } },
        ]

        expect(findPatternPlacements('crrrc', map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: 1 }, rotation: 0 },
            ])
    })

    it('should only return continuous placements for river tiles', () => {
        const map = [
            { pattern: 'ffwfw', placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findPatternPlacements('wfwfw', map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 0 },
            ])
    })

    it('should return proper variations for river tiles (1)', () => {
        const map = [
            { pattern: 'ffwfw', placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(findPatternPlacements('cwwwf', map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 1 },
                { position: { x: 0, y: -1 }, rotation: 3 },
            ])

        expect(findPatternPlacements('wwwff', map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 0 },
            ])

        expect(findPatternPlacements('ffwfw', map))
            .to.deep.equalInAnyOrder([
                { position: { x: 0, y: -1 }, rotation: 2 },
            ])
    })

    it('should return proper variations for river tiles (2)', () => {
        const map = [
            { pattern: 'ffwfw', placement: { rotation: 1, position: { x: 0, y: 0 } } }
        ]

        expect(findPatternPlacements('cwwwf', map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 0 }, rotation: 0 },
                { position: { x: -1, y: 0 }, rotation: 2 },
            ])

        expect(findPatternPlacements('wwwff', map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 0 }, rotation: 2 },
            ])

        expect(findPatternPlacements('ffwfw', map))
            .to.deep.equalInAnyOrder([
                { position: { x: -1, y: 0 }, rotation: 3 },
            ])
    })
})
