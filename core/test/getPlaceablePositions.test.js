import './setup.js'
import { expect } from 'chai'
import { getPlaceablePositions } from '../src/getPlaceablePositions.js'

describe('getPlaceablePositions()', () => {
    it('should return free placements on empty map', () => {
        const map = [
            { pattern: 'crccr', placement: { rotation: 0, position: { x: 0, y: 0 } } }
        ]

        expect(getPlaceablePositions(map))
            .to.deep.equalInAnyOrder([
                { x: -1, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: -1 },
                { x: 0, y: 1 },
            ])
    })

    it('should return free placements on simple map', () => {
        const map = [
            { pattern: 'crrrf', placement: { rotation: 0, position: { x: 0,  y: 0 } } },
            { pattern: 'crccr', placement: { rotation: 0, position: { x: 1,  y: 1 } } },
            { pattern: 'crccr', placement: { rotation: 1, position: { x: 1,  y: 0 } } },
            { pattern: 'crccr', placement: { rotation: 2, position: { x: -1, y: 0 } } },
            { pattern: 'crccr', placement: { rotation: 3, position: { x: -1, y: 1 } } },
        ]

        expect(getPlaceablePositions(map))
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
