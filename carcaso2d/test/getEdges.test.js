import { expect } from 'chai'
import { getEdges } from '../src/getEdges.js'

describe('getEdges()', () => {
    it('should return edges of tiles', () => {
        expect(getEdges({ pattern: 'cfffc' }))
            .to.deep.eq(['c', 'f', 'c', 'f'])
        
        expect(getEdges({ pattern: 'ccacr' }))
            .to.deep.eq(['c', 'c', 'r', 'c'])
        
        expect(getEdges({ pattern: 'ffmff' }))
            .to.deep.eq(['f', 'f', 'f', 'f'])
    })
})
