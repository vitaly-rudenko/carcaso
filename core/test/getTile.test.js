import { expect } from 'chai'
import { getTile } from '../src/getTile.js'

describe('getTile()', () => {
  const tile1 = { pattern: 'crrrf', placement: { rotation: 0, position: { x: 0,  y: 0 } } }
  const tile2 = { pattern: 'crccr', placement: { rotation: 0, position: { x: 1,  y: 2 } } }
  const tile3 = { pattern: 'crccr', placement: { rotation: 1, position: { x: -1, y: 0 } } }

  const map = [tile1, tile2, tile3]

  it('should return map tile', () => {
    expect(getTile(map, { x: 0,  y: 0 })).to.eq(tile1)
    expect(getTile(map, { x: 1,  y: 2 })).to.eq(tile2)
    expect(getTile(map, { x: -1, y: 0 })).to.eq(tile3)
  })

  it('should return "undefined" when not found', () => {
    expect(getTile(map, { x: -1, y: -1 })).to.be.undefined
    expect(getTile(map, { x: 0,  y: 2  })).to.be.undefined
    expect(getTile(map, { x: -5, y: 5  })).to.be.undefined
  })
})