/**
 * Rotate compact 5x1 string pattern.
 * 
 * @param {string} pattern
 * @param {number} rotation
 * @returns {string}
 */
export function rotatePattern(pattern, rotation) {
    const [top, left, center, right, bottom] = pattern

    if (typeof rotation !== 'number' || !Number.isInteger(rotation)) {
        throw new Error(`Invalid rotation: ${rotation}`)
    }

    rotation = rotation % 4
    if (rotation < 0) {
        rotation = 4 + rotation
    }

    switch (rotation) {
        case 0: return top    + left   + center + right  + bottom
        case 1: return left   + bottom + center + top    + right
        case 2: return bottom + right  + center + left   + top
        case 3:
        default: return right  + top    + center + bottom + left
    }
}
