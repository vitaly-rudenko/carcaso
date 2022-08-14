import { expect } from 'chai'
import { Feature } from '../src/Feature.js'
import { isMeeplePlaceableFeature } from '../src/isMeeplePlaceableFeature.js'

describe('isMeeplePlaceableFeature()', () => {
  it('should return true when meeple can be placed', () => {
    expect(isMeeplePlaceableFeature(Feature.CITY)).to.be.true
    expect(isMeeplePlaceableFeature(Feature.FIELD)).to.be.true
    expect(isMeeplePlaceableFeature(Feature.MONASTERY)).to.be.true
    expect(isMeeplePlaceableFeature(Feature.ROAD)).to.be.true
  })

  it('should return false when meeple cannot be placed', () => {
    expect(isMeeplePlaceableFeature(Feature.COAT_OF_ARMS)).to.be.false
    expect(isMeeplePlaceableFeature(Feature.BORDER)).to.be.false
    expect(isMeeplePlaceableFeature(Feature.RIVER)).to.be.false
    expect(isMeeplePlaceableFeature(Feature.TOWN)).to.be.false
  })
})