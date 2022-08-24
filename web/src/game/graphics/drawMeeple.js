import { getVisualFeatureColor } from '../visual-features/getVisualFeatureColor'

const OwnerColor = {
    red: 0xff5555,
    green: 0x55ff55,
    blue: 0x5555ff,
    yellow: 0xffff55,
    black: 0x000000,
}

export function drawMeeple(owner, g, x, y, featureWidth, featureHeight, feature) {
    g.beginFill(0x000000, 0.5)
    g.drawCircle(
        x + featureWidth / 2,
        y + featureHeight * 0.5,
        featureWidth * 0.5
    )
    g.drawCircle(
        x + featureWidth / 2,
        y,
        featureWidth * 0.35
    )
    g.endFill()

    g.beginFill(owner ? OwnerColor[owner] : getVisualFeatureColor(feature))
    g.drawCircle(
        x + featureWidth / 2,
        y + featureHeight * 0.5,
        featureWidth * 0.4
    )
    g.drawCircle(
        x + featureWidth / 2,
        y,
        featureWidth * 0.25
    )
    g.endFill()
}
