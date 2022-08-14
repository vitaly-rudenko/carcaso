import { getTile } from './getTile.js'
import { getPositionsAround } from './getPositionsAround.js'

/**
 * Get tiles around specified coordinates.
 * 
 * Result:  
 * ```
 *     [ top, left, right, bottom ]  
 * ```
 * With corners:  
 * ```
 *     [ topLeft,    top,    topRight,  
 *     left,               right,  
 *     bottomLeft, bottom, bottomRight ]
 * ``` 
 * @param {import('./types').Map} map
 * @param {import('./types').Position} position 
 * @returns {(import('./types').Tile | undefined)[]}
 */
export function getTilesAround(position, map, { includeCorners = false } = {}) {
    const positions = getPositionsAround(position, { includeCorners })
    return positions.map(position => getTile(map, position))
}
