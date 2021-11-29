import { Feature } from './Feature.js'

export function isMeeplePlaceableFeature(feature) {
    return [Feature.CITY, Feature.MONASTERY, Feature.ROAD, Feature.FIELD].includes(feature)
}
