import { Feature } from '@vitalyrudenko/carcaso-core'
import { getVisualFeatureColor } from '../visual-features/getVisualFeatureColor.js'

export function drawMonastery(g, x, y, width, height) {
    g.beginFill(getVisualFeatureColor(Feature.FIELD))
    g.drawRect(x, y, width, height)
    g.endFill()

    g.beginFill(getVisualFeatureColor(Feature.MONASTERY))
    g.drawPolygon([
        x - width * 0.5, y - height * 0.2,
        x - width * 0.5, y + height * 1.2,
        x + width + width * 0.5, y + height * 1.2,
        x + width + width * 0.5, y - height * 0.2,
        x + width * 0.5, y - height * 0.8,
    ])
    g.endFill()
}
