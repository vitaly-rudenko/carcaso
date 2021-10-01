import { isCityFeature } from '@vitalyrudenko/carcaso-core'

export function areFeaturesEqual(feature1, feature2) {
    return feature1 === feature2 || (isCityFeature(feature1) && isCityFeature(feature2))
}
