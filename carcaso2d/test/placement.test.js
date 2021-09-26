import chai, { expect } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { getFreePlacements, getPlacements } from '../src/placement.js'

chai.use(deepEqualInAnyOrder)

describe('[placement]', () => {
    describe('getPlacements()', () => {
        it('should return possible placements for tiles', () => {
            const map = [{ x: 0, y: 0, pattern: 'crccr', rotation: 0 }]
    
            expect(getPlacements('crrrf', map))
                .to.deep.equalInAnyOrder([
                    { x: -1, y: 0,  rotation: 0 },
                    { x: -1, y: 0,  rotation: 2 },
                    { x: 0,  y: -1, rotation: 1 },
                    { x: 0,  y: -1, rotation: 3 },
                    { x: 1,  y: 0,  rotation: 3 },
                    { x: 0,  y: 1,  rotation: 2 },
                ])
        })
    })

    describe('getFreePlacements()', () => {
        it('should return free placements', () => {
            const map = [{ x: 0, y: 0, pattern: 'crccr', rotation: 0 }]

            expect(getFreePlacements(map))
                .to.deep.equalInAnyOrder([
                    { x: -1, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: -1 },
                    { x: 0, y: 1 },
                ])
        })
    })
})
