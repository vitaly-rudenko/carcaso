/**
 * Rotate 5x5 pattern matrix clock-wise.
 * 
 * @param {import('./types').PatternMatrix} matrix
 * @returns {import('./types').PatternMatrix}
 */
export function rotateMatrix(matrix) {
    const width = matrix[0].length
    const height = matrix.length
    const result = Array.from(new Array(width), () => new Array(height).fill(undefined))

    for (const [i, row] of matrix.entries()) {
        for (const [j, item] of row.entries()) {
            result[j][height - i - 1] = item
        }
    }

    return result
}
