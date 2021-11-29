import { expect } from 'chai'
import { Feature } from '../src/Feature.js'
import { getFeatureBlob } from '../src/getFeatureBlob.js'

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

    it.only('should get a simple feature blob', () => {
        expect(getFeatureBlob({ x: 7, y: -3 }, map))
            .to.deep.eq({
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
})
