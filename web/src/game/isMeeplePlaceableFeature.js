import { Feature } from '@vitalyrudenko/carcaso-core'

export function isMeeplePlaceableFeature(feature) {
    return [Feature.CITY, Feature.MONASTERY, Feature.ROAD, Feature.FIELD].includes(feature)
}
