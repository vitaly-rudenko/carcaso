import './setup.js'
import { expect } from 'chai'
import { getMatrixItemsAround } from '../src/getMatrixItemsAround.js'

describe('getMatrixItemsAround()', () => {
  it('should return matrix items around position', () => {
    const matrix = [
      ['r', 'f', 'w', 'w', 'a'],
      ['f', 'f', 'w', 'w', 'a'],
      ['w', 'w', 'm', 'w', 'w'],
      ['f', 'w', 'w', 'f', 'f'],
      ['b', 'f', 'f', 'f', 'r'],
    ]

    expect(getMatrixItemsAround(matrix, { x: 4, y: 2 }, { includeCorners: false }))
      .to.deep.eq(['f', 'w', 'a'])

    expect(getMatrixItemsAround(matrix, { x: 3, y: 1 }, { includeCorners: true }))
      .to.deep.eq([
        'm', 'w', 'w',
        'w',      'a',
        'w', 'w', 'a',
      ])
  })
})
