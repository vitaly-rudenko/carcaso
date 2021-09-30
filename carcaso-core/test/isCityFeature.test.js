import { expect } from 'chai'
import { Feature } from '../src/Feature.js'
import { isCityFeature } from '../src/isCityFeature.js'

describe('isCityFeature()', () => {
    it('should return true for city features', () => {
        expect(isCityFeature(Feature.CITY)).to.be.true
        expect(isCityFeature(Feature.COAT_OF_ARMS)).to.be.true
    })

    it('should return false for non-city features', () => {
        expect(isCityFeature(Feature.FIELD)).to.be.false
        expect(isCityFeature(Feature.MONASTERY)).to.be.false
        expect(isCityFeature(Feature.RIVER)).to.be.false
        expect(isCityFeature(Feature.ROAD)).to.be.false
    })
})