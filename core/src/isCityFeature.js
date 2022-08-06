import { Feature } from './Feature.js'

export function isCityFeature(feature) {
    return feature === Feature.CITY || feature === Feature.COAT_OF_ARMS
}
