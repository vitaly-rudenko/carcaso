import { expect } from 'chai'
import { getRotated } from '../src/rotation.js'

describe('getRotated()', () => {
    it('should return rotated tiles', () => {
        expect(getRotated({ pattern: 'tlcrb', rotation: 0 }))
            .to.deep.eq('tlcrb')
        
        expect(getRotated({ pattern: 'tlcrb', rotation: 1 }))
            .to.deep.eq('lbctr')
        
        expect(getRotated({ pattern: 'tlcrb', rotation: 2 }))
            .to.deep.eq('brclt')

        expect(getRotated({ pattern: 'tlcrb', rotation: 3 }))
            .to.deep.eq('rtcbl')
    })

    it('should throw an error for invalid rotations', () => {
        expect(() => getRotated({ pattern: 'tlcrb', rotation: -1 }))
            .to.throw('Invalid rotation: -1')
        
        expect(() => getRotated({ pattern: 'tlcrb', rotation: 4 }))
            .to.throw('Invalid rotation: 4')
        
        expect(() => getRotated({ pattern: 'tlcrb', rotation: 'abc' }))
            .to.throw('Invalid rotation: abc')
    })
})
