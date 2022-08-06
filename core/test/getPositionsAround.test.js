import { expect } from 'chai'
import { getPositionsAround } from '../src/getPositionsAround.js'

describe('getPositionsAround()', () => {
    it('should return positions around', () => {
        expect(getPositionsAround({ x: 0, y: 0 }))
            .to.deep.eq([
                { x: 0, y: 1 },  // top
                { x: -1, y: 0 }, // left
                { x: 1, y: 0 },  // right
                { x: 0, y: -1 }, // bottom
            ])

        expect(getPositionsAround({ x: 10, y: 5 }))
            .to.deep.eq([
                { x: 10, y: 6 }, // top
                { x: 9, y: 5 },  // left
                { x: 11, y: 5 }, // right
                { x: 10, y: 4 }, // bottom
            ])
    })

    it('should return positions around (including corners)', () => {
        expect(getPositionsAround({ x: 0, y: 0 }, { includeCorners: true }))
            .to.deep.eq([
                { x: -1, y: 1 },  // top left
                { x: 0, y: 1 },   // top
                { x: 1, y: 1 },   // top right
                { x: -1, y: 0 },  // left
                { x: 1, y: 0 },   // right
                { x: -1, y: -1 }, // bottom left
                { x: 0, y: -1 },  // bottom
                { x: 1, y: -1 },  // bottom right
            ])

        expect(getPositionsAround({ x: 10, y: 5 }, { includeCorners: true }))
            .to.deep.eq([
                { x: 9, y: 6 },  // top left
                { x: 10, y: 6 }, // top
                { x: 11, y: 6 }, // top right
                { x: 9, y: 5 },  // left
                { x: 11, y: 5 }, // right
                { x: 9, y: 4 },  // bottom left
                { x: 10, y: 4 }, // bottom
                { x: 11, y: 4 }, // bottom right
            ])
    })
})
