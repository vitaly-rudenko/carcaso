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
export function getPositionsAround(position, { includeCorners = false } = {}) {
    const { x, y } = position

    if (includeCorners) {
        return [
            { x: x - 1, y: y + 1 },
            { x, y: y + 1 },
            { x: x + 1, y: y + 1 },
            { x: x - 1, y },
            { x: x + 1, y },
            { x: x - 1, y: y - 1 },
            { x, y: y - 1 },
            { x: x + 1, y: y - 1 },
        ]
    }

    return [
        { x, y: y + 1 },
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
    ]
}

