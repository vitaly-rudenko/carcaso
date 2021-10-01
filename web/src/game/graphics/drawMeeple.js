const OwnerColor = {
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x00ff00,
    yellow: 0xffff00,
    black: 0x000000,
}

export function drawMeeple(owner, g, x, y, featureWidth, featureHeight) {
    if (owner) {
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

        g.beginFill(OwnerColor[owner])
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
    } else {
        g.beginFill(0x000000, 0.4)
        g.drawCircle(
            x + featureWidth / 2,
            y + featureHeight / 2,
            featureWidth * 0.4
        )
        g.endFill()
    }
}
