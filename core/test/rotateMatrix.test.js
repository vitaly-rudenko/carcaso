import { expect } from 'chai'
import { rotateMatrix } from '../src/rotateMatrix.js'

describe('rotateMatrix()', () => {
  it('should rotate matrix clock-wise', () => {
    expect(
      rotateMatrix([
        ['a', 'f', 'w', 'f', 'r'],
        ['f', 'w', 'w', 'w', 'f'],
        ['w', 'w', 'm', 'w', 'w'],
        ['f', 'w', 'w', 'w', 'f'],
        ['r', 'f', 'w', 'f', 'b'],
      ])
    ).to.deep.eq([
      ['r', 'f', 'w', 'f', 'a'],
      ['f', 'w', 'w', 'w', 'f'],
      ['w', 'w', 'm', 'w', 'w'],
      ['f', 'w', 'w', 'w', 'f'],
      ['b', 'f', 'w', 'f', 'r'],
    ])
  })
});