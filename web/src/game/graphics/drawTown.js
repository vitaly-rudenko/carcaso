import { Feature } from '@vitalyrudenko/carcaso-core'
import { getVisualFeatureColor } from '../visual-features/getVisualFeatureColor.js'

/** @param {import('pixi.js').Graphics} g */
export function drawTown(g, x, y, width, height) {
    g.beginFill(getVisualFeatureColor(Feature.TOWN))
    g.drawCircle(x + width / 2, y + height / 2, Math.sqrt(width ** 2))
    g.endFill()
}
