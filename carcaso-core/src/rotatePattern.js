export function rotatePattern(pattern, rotation) {
    const [top, left, center, right, bottom] = pattern

    switch (rotation) {
        case 0: return top    + left   + center + right  + bottom
        case 1: return left   + bottom + center + top    + right
        case 2: return bottom + right  + center + left   + top
        case 3: return right  + top    + center + bottom + left
        default: throw new Error(`Invalid rotation: ${rotation}`)
    }
}
