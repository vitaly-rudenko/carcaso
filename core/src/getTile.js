/**
 * Get map tile for a specified position.
 * 
 * @param {import('./types').Map} map
 * @param {import('./types').Position} position 
 * @returns {import('./types').Tile | undefined}
 */
export function getTile(map, position) {
    return map.find(tile => tile.placement.position.x === position.x && tile.placement.position.y === position.y)
}
