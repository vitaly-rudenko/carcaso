import { isCityFeature } from './isCityFeature.js'

/**
 * @param {string} feature1
 * @param {string} feature2
 * @returns {boolean}
 */
export function areFeaturesEqual(feature1, feature2) {
  return feature1 === feature2 || (isCityFeature(feature1) && isCityFeature(feature2))
}