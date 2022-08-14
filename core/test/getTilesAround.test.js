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
            undefined, // top
            undefined, // left
            undefined, // right
            undefined, // bottom
        ])

        expect(
            getTilesAround(position(center), completeMap)
        ).to.deep.eq([top, left, right, bottom])

        expect(
            getTilesAround(position(bottomRight), completeMap)
        ).to.deep.eq([right, bottom, undefined, undefined])
    })

    it('should return positions around (including corners)', () => {
        expect(
            getTilesAround(position(center), emptyMap, { includeCorners: true })
        ).to.deep.eq([
            undefined, // top left
            undefined, // top
            undefined, // top right
            undefined, // left
            undefined, // right
            undefined, // bottom left
            undefined, // bottom
            undefined, // bottom right
        ])

        expect(
            getTilesAround(position(center), completeMap, { includeCorners: true })
        ).to.deep.eq([topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight])

        expect(
            getTilesAround(position(bottomRight), completeMap, { includeCorners: true })
        ).to.deep.eq([center, right, undefined, bottom, undefined, undefined, undefined, undefined])
    })
})

function position(tile) {
    return tile.placement.position
}
