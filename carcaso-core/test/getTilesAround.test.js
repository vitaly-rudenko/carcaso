import { expect } from 'chai'
import { getTilesAround } from '../src/getTilesAround.js'

describe('getTilesAround()', () => {
    const topLeft = { placement: { position: { x: -1, y: 1 } } }
    const top = { placement: { position: { x: 0, y: 1 } } }
    const topRight = { placement: { position: { x: 1, y: 1 } } }
    const left = { placement: { position: { x: -1, y: 0 } } }
    const center = { placement: { position: { x: 0, y: 0 } } }
    const right = { placement: { position: { x: 1, y: 0 } } }
    const bottomLeft = { placement: { position: { x: -1, y: -1 } } }
    const bottom = { placement: { position: { x: 0, y: -1 } } }
    const bottomRight = { placement: { position: { x: 1, y: -1 } } }

    const emptyMap = [center]
    const completeMap = [topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight]

    it('should return positions around', () => {
        expect(
            getTilesAround(position(center), emptyMap)
        ).to.deep.eq([
            null, // top
            null, // left
            null, // right
            null, // bottom
        ])

        expect(
            getTilesAround(position(center), completeMap)
        ).to.deep.eq([top, left, right, bottom])

        expect(
            getTilesAround(position(bottomRight), completeMap)
        ).to.deep.eq([right, bottom, null, null])
    })

    it('should return positions around (including corners)', () => {
        expect(
            getTilesAround(position(center), emptyMap, { includeCorners: true })
        ).to.deep.eq([
            null, // top left
            null, // top
            null, // top right
            null, // left
            null, // right
            null, // bottom left
            null, // bottom
            null, // bottom right
        ])

        expect(
            getTilesAround(position(center), completeMap, { includeCorners: true })
        ).to.deep.eq([topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight])

        expect(
            getTilesAround(position(bottomRight), completeMap, { includeCorners: true })
        ).to.deep.eq([center, right, null, bottom, null, null, null, null])
    })
})

function position(tile) {
    return tile.placement.position
}
