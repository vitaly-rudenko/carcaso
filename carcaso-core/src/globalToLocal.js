export function globalToLocal(position) {
    const tilePosition = {
        x: Math.floor(position.x / 5),
        y: Math.floor(position.y / 5),
    }

    return {
        tilePosition,
        featurePosition: {
            x: position.x - tilePosition.x * 5,
            y: position.y - tilePosition.y * 5,
        }
    }
}
