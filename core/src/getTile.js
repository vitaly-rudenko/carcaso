export function getTile(map, position) {
    return map.find(tile => tile.placement.position.x === position.x && tile.placement.position.y === position.y) || null
}
