import { getTile } from './getTile.js'
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
export function getTilesAround(position, map, { includeCorners = false } = {}) {
    const positions = getPositionsAround(position, { includeCorners })
    return positions.map(position => getTile(map, position))
}
