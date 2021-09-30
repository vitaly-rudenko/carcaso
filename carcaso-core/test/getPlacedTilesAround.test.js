import { expect } from 'chai'
import { getPlacedTilesAround } from '../src/getPlacedTilesAround.js'

describe('getPlacedTilesAround()', () => {
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
            getPlacedTilesAround(center, emptyMap)
        ).to.deep.eq([
            null, // top
            null, // left
            null, // right
            null, // bottom
        ])

        expect(
            getPlacedTilesAround(center, completeMap)
        ).to.deep.eq([top, left, right, bottom])

        expect(
            getPlacedTilesAround(bottomRight, completeMap)
        ).to.deep.eq([right, bottom, null, null])
    })

    it('should return positions around (including corners)', () => {
        expect(
            getPlacedTilesAround(center, emptyMap, { includeCorners: true })
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
            getPlacedTilesAround(center, completeMap, { includeCorners: true })
        ).to.deep.eq([topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight])

        expect(
            getPlacedTilesAround(bottomRight, completeMap, { includeCorners: true })
        ).to.deep.eq([center, right, null, bottom, null, null, null, null])
    })
})
