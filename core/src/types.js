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

/**
 * @typedef FeatureBlob
 * @property {string} feature
 * @property {Position[]} positions
 */

/** @typedef {Tile[]} Map */
/** @typedef {string[][]} PatternMatrix */

export const _ = {}
