import { getPositionsAround } from './getPositionsAround.js'

/**
 * @param {import('./types').PatternMatrix} matrix
 * @param {import('./types').Position} position
 * @returns {string[]}
 */
export function getMatrixItemsAround(matrix, position, { includeCorners = false } = {}) {
    return getPositionsAround(position, { includeCorners })
        .filter(p => p.y >= 0 && p.y < matrix.length && p.x >= 0 && p.x < matrix[p.y].length)
        .map(p => matrix[p.y][p.x])
}