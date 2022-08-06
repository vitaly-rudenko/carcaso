import { expect } from 'chai'
import { rotatePattern } from '../src/rotatePattern.js'

describe('rotatePattern()', () => {
    const pattern = 'tlcrb'
    
    it('should rotate patterns', () => {
        expect(rotatePattern(pattern, 0)).to.eq(pattern)
        expect(rotatePattern(pattern, 1)).to.eq('lbctr')
        expect(rotatePattern(pattern, 2)).to.eq('brclt')
        expect(rotatePattern(pattern, 3)).to.eq('rtcbl')
        expect(rotatePattern(pattern, 4)).to.eq(pattern)
        expect(rotatePattern(pattern, 5)).to.eq(rotatePattern(pattern, 1))
        expect(rotatePattern(pattern, 6)).to.eq(rotatePattern(pattern, 2))
        expect(rotatePattern(pattern, 7)).to.eq(rotatePattern(pattern, 3))
    })

    it('should support negative rotation values', () => {
        expect(rotatePattern(rotatePattern(pattern, 1), -1)).to.eq(pattern)
        expect(rotatePattern(rotatePattern(pattern, 2), -2)).to.eq(pattern)
        expect(rotatePattern(rotatePattern(pattern, 3), -3)).to.eq(pattern)
        expect(rotatePattern(rotatePattern(pattern, 4), -4)).to.eq(pattern)
        expect(rotatePattern(rotatePattern(pattern, 5), -5)).to.eq(pattern)
        expect(rotatePattern(rotatePattern(pattern, 6), -6)).to.eq(pattern)
        expect(rotatePattern(rotatePattern(pattern, 7), -7)).to.eq(pattern)
    })

    it('should throw an error for invalid rotations', () => {
        expect(() => rotatePattern(pattern, -0.5)).to.throw('Invalid rotation: -0.5')
        expect(() => rotatePattern(pattern, 1.5)).to.throw('Invalid rotation: 1.5')
        expect(() => rotatePattern(pattern, Infinity)).to.throw('Invalid rotation: Infinity')
        expect(() => rotatePattern(pattern, 'abc')).to.throw('Invalid rotation: abc')
    })
})
