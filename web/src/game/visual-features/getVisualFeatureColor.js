import { VisualFeature } from './VisualFeature.js'

export function getVisualFeatureColor(feature) {
    switch (feature) {
        case VisualFeature.BORDER:
        case VisualFeature.CONNECTOR: return 0x9e9990
        case VisualFeature.CITY: return 0xd9be68
        case VisualFeature.COAT_OF_ARMS: return 0x565B96
        case VisualFeature.FIELD: return 0x7BB93D
        case VisualFeature.MONASTERY: return 0xD16547
        case VisualFeature.RIVER: return 0xaacfe3
        case VisualFeature.ROAD: return 0xEDF6E8
        case VisualFeature.TOWN: return 0xe6d08a
        default: throw new Error(`Invalid visual feature: ${feature}`)
    }
}
