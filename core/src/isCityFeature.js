import { Feature } from './Feature.js'

/** @param {string} feature */
export function isCityFeature(feature) {
    return feature === Feature.CITY || feature === Feature.COAT_OF_ARMS
}
