import { expect } from 'chai'
import { rotatePattern } from '../src/rotatePattern.js'

describe('rotatePattern()', () => {
    it('should return rotated tiles', () => {
        expect(rotatePattern('tlcrb', 0)).to.deep.eq('tlcrb')
        expect(rotatePattern('tlcrb', 1)).to.deep.eq('lbctr')
        expect(rotatePattern('tlcrb', 2)).to.deep.eq('brclt')
        expect(rotatePattern('tlcrb', 3)).to.deep.eq('rtcbl')
    })

    it('should throw an error for invalid rotations', () => {
        expect(() => rotatePattern('tlcrb', -1)).to.throw('Invalid rotation: -1')
        expect(() => rotatePattern('tlcrb', 4)).to.throw('Invalid rotation: 4')
        expect(() => rotatePattern('tlcrb', 'abc')).to.throw('Invalid rotation: abc')
    })
})
