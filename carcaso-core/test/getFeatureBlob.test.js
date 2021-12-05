import chai, { expect } from 'chai'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import { Feature } from '../src/Feature.js'
import { getFeatureBlob } from '../src/getFeatureBlob.js'

chai.use(deepEqualInAnyOrder)

describe('getFeatureBlob()', () => {
    const map = [
        { pattern: 'cffcf', placement: { position: { x: -1, y: -1 },  rotation: 2 } },
        { pattern: 'wfwwf', placement: { position: { x: 0,  y: -1 },  rotation: 0 } },
        { pattern: 'rwrwr', placement: { position: { x: 1,  y: -1 },  rotation: 0 } },
        { pattern: 'fcccf', placement: { position: { x: -1, y: 0 },  rotation: 1 } },
        { pattern: 'ffmff', placement: { position: { x: 0,  y: 0 },  rotation: 0 } },
        { pattern: 'frtrr', placement: { position: { x: 1,  y: 0 },  rotation: 3 } },
        { pattern: 'cfacf', placement: { position: { x: -1, y: 1 }, rotation: 0 } },
        { pattern: 'fcrrr', placement: { position: { x: 0,  y: 1 }, rotation: 0 } },
        { pattern: 'rrrww', placement: { position: { x: 1,  y: 1 }, rotation: 0 } },
    ]

    it('should get a simple feature blob (1)', () => {
        expect(getFeatureBlob({ x: 7, y: -3 }, map))
            .to.deep.equalInAnyOrder({
                feature: Feature.ROAD,
                positions: [
                    { x: 7, y: -5 },
                    { x: 7, y: -4 },
                    { x: 7, y: -3 },
                    { x: 7, y: -2 },
                    { x: 7, y: -1 },
                    { x: 7, y: 0 },
                    { x: 7, y: 1 },
                ]
            })
    })

    it('should get a simple feature blob (2)', () => {
        expect(getFeatureBlob({ x: -2, y: 6 }, map))
            .to.deep.equalInAnyOrder({
                feature: Feature.CITY,
                positions: [
                    { x: -4, y: -1 },
                    { x: -3, y: -1 },
                    { x: -2, y: -1 },
                    { x: -4, y: 0 },
                    { x: -3, y: 0 },
                    { x: -2, y: 0 },
                    { x: -4, y: 1 },
                    { x: -2, y: 1 },
                    { x: -3, y: 1 },
                    { x: -4, y: 2 },
                    { x: -2, y: 2 },
                    { x: -3, y: 2 },
                    { x: -4, y: 3 },
                    { x: -2, y: 3 },
                    { x: -3, y: 3 },
                    { x: -4, y: 4 },
                    { x: -2, y: 4 },
                    { x: -3, y: 4 },
                    { x: -4, y: 5 },
                    { x: -2, y: 5 },
                    { x: -3, y: 5 },
                    { x: 0, y: 6 },
                    { x: -1, y: 5 },
                    { x: -1, y: 6 },
                    { x: -2, y: 6 },
                    { x: -3, y: 6 },
                    { x: 0, y: 7 },
                    { x: -1, y: 7 },
                    { x: -2, y: 7 },
                    { x: 0, y: 8 },
                    { x: -1, y: 8 },
                ]
            })
    })
})
