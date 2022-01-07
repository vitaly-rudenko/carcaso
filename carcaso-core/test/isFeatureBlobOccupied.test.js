import { expect } from 'chai'
import { isFeatureBlobOccupied } from '../src/isFeatureBlobOccupied.js'

describe('isFeatureBlobOccupied()', () => {
    it('should return false if not occupied by meeple', () => {
        const map = [
            { pattern: 'cffcf', placement: { position: { x: -1, y: -1 }, rotation: 2 } },
            { pattern: 'wfwwf', placement: { position: { x: 0,  y: -1 }, rotation: 0 } },
            { pattern: 'rwrwr', placement: { position: { x: 1,  y: -1 }, rotation: 0 } },
            { pattern: 'fcccf', placement: { position: { x: -1, y: 0 },  rotation: 1 } },
            { pattern: 'ffmff', placement: { position: { x: 0,  y: 0 },  rotation: 0 } },
            { pattern: 'frtrr', placement: { position: { x: 1,  y: 0 },  rotation: 3 } },
            { pattern: 'cfacf', placement: { position: { x: -1, y: 1 },  rotation: 0 } },
            { pattern: 'fcrrr', placement: { position: { x: 0,  y: 1 },  rotation: 0 } },
            { pattern: 'rrrww', placement: { position: { x: 1,  y: 1 },  rotation: 0 } },
        ]

        expect(isFeatureBlobOccupied({ x: 7, y: -3 }, map)).to.be.false
        expect(isFeatureBlobOccupied({ x: -3, y: 2 }, map)).to.be.false
    })

    it('should return true if occupied by meeple', () => {
        const map = [
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

        // road
        expect(isFeatureBlobOccupied({ x: -1, y: 7 }, map)).to.be.true // same position as meeple
        expect(isFeatureBlobOccupied({ x: 3, y: 9 }, map)).to.be.true // connected road (different tile)
        expect(isFeatureBlobOccupied({ x: 7, y: -3 }, map)).to.be.false // adjacent, but not connected road
        expect(isFeatureBlobOccupied({ x: 7, y: 7 }, map)).to.be.false // different feature in the same tile as meeple
        
        // city
        expect(isFeatureBlobOccupied({ x: 6, y: 5 }, map)).to.be.true // same position as meeple
        expect(isFeatureBlobOccupied({ x: -4, y: 0 }, map)).to.be.true // connected city (different tile)
        expect(isFeatureBlobOccupied({ x: 0, y: 2 }, map)).to.be.false // adjacent, but not connected city
        expect(isFeatureBlobOccupied({ x: -3, y: 7 }, map)).to.be.false // different feature in the same tile as meeple
    })
})
