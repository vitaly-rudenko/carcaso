/**
 * @typedef Position
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef Placement
 * @property {number} rotation 
 * @property {Position} position
 */


/**
 * @typedef Meeple
 * @property {string} owner 
 * @property {Position} position
 */

/**
 * @typedef Tile
 * @property {string} pattern 
 * @property {Placement} placement 
 * @property {Meeple} [meeple] 
 */

/** @typedef {Tile[]} Map */

/** @typedef {'f' | 'r' | 't' | 'c' | 'w' | 'm' | 'a' | 'b'} Feature */
/** @typedef {[Feature, Feature, Feature, Feature, Feature]} PatternMatrixRow */
/** @typedef {[PatternMatrixRow, PatternMatrixRow, PatternMatrixRow, PatternMatrixRow, PatternMatrixRow]} PatternMatrix */

export const _ = {}
