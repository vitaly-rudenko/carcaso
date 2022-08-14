import './setup.js'
import { expect } from 'chai'
import { getFeatureBlobs } from '../src/getFeatureBlobs.js'

describe('getFeatureBlobs()', () => {
  it('should return feature blob positions', () => {
    const matrix = [
      ['r', 'f', 'w', 'w', 'a'],
      ['f', 'f', 'w', 'w', 'a'],
      ['w', 'w', 'm', 'w', 'w'],
      ['f', 'w', 'w', 'f', 'f'],
      ['b', 'f', 'f', 'f', 'r'],
    ]

    console.log(JSON.stringify(getFeatureBlobs(matrix)))

    expect(getFeatureBlobs(matrix)).to.deep.eq([
      { feature: 'r', positions: [{ x: 0, y: 0 }] },
      { feature: 'f', positions: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }] },
      { feature: 'w', positions: [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 2 }, { x: 4, y: 2 }] },
      { feature: 'a', positions: [{ x: 4, y: 0 }, { x: 4, y: 1 }] },
      { feature: 'w', positions: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }] },
      { feature: 'm', positions: [{ x: 2, y: 2 }] },
      { feature: 'f', positions: [{ x: 0, y: 3 }] },
      { feature: 'f', positions: [{ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 2, y: 4 }, { x: 1, y: 4 }] },
      { feature: 'b', positions: [{ x: 0, y: 4 }] },
      { feature: 'r', positions: [{ x: 4, y: 4 }] }
    ])
  })
})
