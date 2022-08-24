import { expect } from 'chai'
import { buildMapMatrix, isPositionOccupiedByMeeple } from '../src/isPositionOccupiedByMeeple.js'
import { createMap } from './fixtures/map.js'

describe('isPositionOccupiedByMeeple()', () => {
  it('should return false when not occupied', () => {
    const map = createMap()

    for (let tx = -1; tx <= 1; tx++) {
      for (let ty = -1; ty <= 1; ty++) {
        for (let mx = -1; mx <= 1; mx++) {
          for (let my = -1; my <= 1; my++) {
            expect(isPositionOccupiedByMeeple(map, { x: tx, y: ty }, { x: mx, y: my })).to.be.false
          }
        }
      }
    }
  })

  it.skip('should return true when occupied', () => {
    const map = createMap([
      { placement: { position: { x: -1, y: 1 }  }, meeple: { owner: 'red',    position: { x: 3, y: 3 } } },
      { placement: { position: { x: 0,  y: 1 }  }, meeple: { owner: 'green',  position: { x: 2, y: 2 } } },
      { placement: { position: { x: 1,  y: 1 }  }, meeple: { owner: 'blue',   position: { x: 2, y: 0 } } },
      { placement: { position: { x: 1,  y: 0 }  }, meeple: { owner: 'yellow', position: { x: 2, y: 2 } } },
      { placement: { position: { x: -1, y: -1 } }, meeple: { owner: 'black',  position: { x: 2, y: 3 } } },
      { placement: { position: { x: 1,  y: -1 } }, meeple: { owner: 'green',  position: { x: 2, y: 2 } } },
    ])

    expect(isPositionOccupiedByMeeple(map, { x: -1, y: 1 }, { x: 1, y: 1 })).to.be.true // city in the same tile
    expect(isPositionOccupiedByMeeple(map, { x: -1, y: 1 }, { x: 3, y: 3 })).to.be.true

    expect(isPositionOccupiedByMeeple(map, { x: 0, y: 1 }, { x: 0, y: 2 })).to.be.true // same city in different tiles
    expect(isPositionOccupiedByMeeple(map, { x: -1, y: 0 }, { x: 2, y: 0 })).to.be.true

    expect(isPositionOccupiedByMeeple(map, { x: 0, y: 1 }, { x: 2, y: 0 })).to.be.false // different contacting city
  })

  describe('buildMapMatrix()', () => {
    it('should build complete map matrix', () => {
      const map = [
        { pattern: 'ccacc', placement: { position: { x: -1, y: 1 }, rotation: 0 } },
        { pattern: 'ccfff', placement: { position: { x: 0, y: 1 }, rotation: 0 } },
        { pattern: 'rftrr', placement: { position: { x: 1, y: 1 }, rotation: 0 } },
        { pattern: 'cffff', placement: { position: { x: -1, y: 0 }, rotation: 0 } },
        { pattern: 'frrrf', placement: { position: { x: 1, y: 0 }, rotation: 1 } },
        { pattern: 'wfwfw', placement: { position: { x: -1, y: -1 }, rotation: 3 } },
        { pattern: 'wwfff', placement: { position: { x: 0, y: -1 }, rotation: 3 } },
        { pattern: 'rfmff', placement: { position: { x: 1, y: -1 }, rotation: 0 } },
      ]

      expect(
        buildMapMatrix(map).map(row => row.map(f => f || '_').join('')).reverse()
      ).to.deep.eq([
        'ccccc bcccb ffrff',
        'ccccc cffff ffrff',
        'ccccc cffff fftrr',
        'ccccc cffff ffrff',
        'ccccc bffff ffrff',

        'bcccb _____ ffrff',
        'fffff _____ ffrff',
        'fffff _____ ffrff',
        'fffff _____ ffrff',
        'fffff _____ ffrff',
        
        'fffff fffff ffrff',
        'fffff fffff fmmmf',
        'wwwww wffff fmmmf',
        'fffff wwfff fmmmf',
        'fffff fwwff fffff',
      ].map(row => row.replaceAll(' ', '')))
    })
  })
})
