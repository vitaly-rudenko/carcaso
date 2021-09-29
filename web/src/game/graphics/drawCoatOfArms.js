import { Feature } from '@vitalyrudenko/carcaso-core'
import { getVisualFeatureColor } from '../visual-features/getVisualFeatureColor.js'

export function drawCoatOfArms(g, x, y, width, height) {
    g.beginFill(getVisualFeatureColor(Feature.CITY))
    g.drawRect(x, y, width, height)
    g.endFill()

    g.beginFill(getVisualFeatureColor(Feature.COAT_OF_ARMS))
    g.drawPolygon([
        x, y - 2 + - height * 0.2,
        x, y - 2 + height,
        x + width * 0.5, y - 2 + height * 1.5,
        x + width, y - 2 + height,
        x + width, y - 2 - height * 0.2,
    ])
    g.endFill()
}
