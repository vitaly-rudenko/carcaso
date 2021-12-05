import chai, { expect } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { getPatternMatrix } from '../src/getPatternMatrix.js'
import { getTileFeatureBlobs } from '../src/getTileFeatureBlobs.js'

chai.use(deepEqualInAnyOrder)

describe('getTileFeatureBlobs()', () => {
    it('should get all tile feature blobs (one feature)', () => {
        expect(
            getTileFeatureBlobs(getPatternMatrix('fffff'))
        ).to.deep.equalInAnyOrder([
            {
                feature: 'f',
                positions: Array.from(new Array(25), (_, i) => ({ x: Math.floor(i / 5), y: i % 5 }))
            }
        ])
    })

    it('should get all tile feature blobs (two features)', () => {
        expect(
            getTileFeatureBlobs(getPatternMatrix('ffmff'))
        ).to.deep.equalInAnyOrder([
            {
                feature: 'f',
                positions: [
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                    { x: 3, y: 0 },
                    { x: 4, y: 0 },
                    { x: 0, y: 1 },
                    { x: 0, y: 2 },
                    { x: 0, y: 3 },
                    { x: 0, y: 4 },
                    { x: 1, y: 4 },
                    { x: 2, y: 4 },
                    { x: 3, y: 4 },
                    { x: 4, y: 4 },
                    { x: 4, y: 1 },
                    { x: 4, y: 2 },
                    { x: 4, y: 3 },
                ]
            },
            {
                feature: 'm',
                positions: [
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                    { x: 3, y: 1 },
                    { x: 1, y: 2 },
                    { x: 2, y: 2 },
                    { x: 3, y: 2 },
                    { x: 1, y: 3 },
                    { x: 2, y: 3 },
                    { x: 3, y: 3 },
                ]
            }
        ])
    })

    it('should get all tile feature blobs (three features)', () => {
        expect(
            getTileFeatureBlobs(getPatternMatrix('rwrrw'))
        ).to.deep.equalInAnyOrder([
            {
                feature: 'f',
                positions: [
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                    { x: 1, y: 2 },
                    { x: 2, y: 2 },
                    { x: 3, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 3 },
                    { x: 4, y: 3 },
                    { x: 3, y: 4 },
                    { x: 4, y: 4 },
                ]
            },
            {
                feature: 'f',
                positions: [
                    { x: 0, y: 4 },
                ]
            },
            {
                feature: 'f',
                positions: [
                    { x: 4, y: 0 },
                ]
            },
            {
                feature: 'r',
                positions: [
                    { x: 2, y: 0 },
                    { x: 3, y: 0 },
                    { x: 3, y: 1 },
                    { x: 4, y: 1 },
                    { x: 4, y: 2 },
                ]
            },
            {
                feature: 'w',
                positions: [
                    { x: 0, y: 2 },
                    { x: 0, y: 3 },
                    { x: 1, y: 3 },
                    { x: 1, y: 4 },
                    { x: 2, y: 4 },
                ]
            },
        ])
    })
});