import { getPlacedTile } from './getPlacedTile.js'
import { getPositionsAround } from './getPositionsAround.js'

/**
    Result:  
    ```
        [ top, left, right, bottom ]  
    ```
    With corners:  
    ```
        [ topLeft,    top,    topRight,  
          left,               right,  
          bottomLeft, bottom, bottomRight ]
    ```
*/
export function getPlacedTilesAround(placedTile, map, { includeCorners = false } = {}) {
    const positions = getPositionsAround(placedTile.placement.position, { includeCorners })
    return positions.map(position => getPlacedTile(map, position))
}
