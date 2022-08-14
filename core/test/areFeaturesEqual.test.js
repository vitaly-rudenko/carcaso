import { expect } from 'chai'
import { areFeaturesEqual } from '../src/areFeaturesEqual.js'
import { Feature } from '../src/Feature.js'

describe('areFeaturesEqual()', () => {
  it('should return true when features are equal', () => {
    const cases = [
      [Feature.BORDER, Feature.BORDER],
      [Feature.FIELD, Feature.FIELD],
      [Feature.MONASTERY, Feature.MONASTERY],
      [Feature.RIVER, Feature.RIVER],
      [Feature.ROAD, Feature.ROAD],
      [Feature.TOWN, Feature.TOWN],
      // edge case
      [Feature.CITY, Feature.CITY],
      [Feature.COAT_OF_ARMS, Feature.COAT_OF_ARMS],
      [Feature.COAT_OF_ARMS, Feature.CITY],
      [Feature.CITY, Feature.COAT_OF_ARMS],
    ]

    for (const [feature1, feature2] of cases) {
      expect(areFeaturesEqual(feature1, feature2)).to.be.true
    }
  })

  it('should return false when features are not equal', () => {
    const cases = [
      [Feature.BORDER, Feature.TOWN],
      [Feature.FIELD, Feature.BORDER],
      [Feature.MONASTERY, Feature.FIELD],
      [Feature.RIVER, Feature.MONASTERY],
      [Feature.ROAD, Feature.RIVER],
      [Feature.TOWN, Feature.ROAD],
      [Feature.CITY, Feature.TOWN],
      [Feature.COAT_OF_ARMS, Feature.RIVER],
    ]

    for (const [feature1, feature2] of cases) {
      expect(areFeaturesEqual(feature1, feature2)).to.be.false
    }
  })
})