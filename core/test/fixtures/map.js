import cloneDeep from 'clone-deep'
import mergeDeep from 'merge-deep'

/** @type {import('../../src/types').Map} */
const initialMap = [
  { pattern: 'ccacc', placement: { position: { x: -1, y: -1 }, rotation: 0 } },
  { pattern: 'ccfff', placement: { position: { x:  0, y: -1 }, rotation: 0 } },
  { pattern: 'rftrr', placement: { position: { x:  1, y: -1 }, rotation: 0 } },
  { pattern: 'cffff', placement: { position: { x: -1, y:  0 }, rotation: 0 } },
  { pattern: 'fffff', placement: { position: { x:  0, y:  0 }, rotation: 0 } },
  { pattern: 'frrrf', placement: { position: { x:  1, y:  0 }, rotation: 1 } },
  { pattern: 'wfwfw', placement: { position: { x: -1, y:  1 }, rotation: 3 } },
  { pattern: 'wwfff', placement: { position: { x:  0, y:  1 }, rotation: 3 } },
  { pattern: 'rfmff', placement: { position: { x:  1, y:  1 }, rotation: 0 } },
]

/** @param {any[]} overrideTiles */
export function createMap(overrideTiles = []) {
  const map = cloneDeep(initialMap)

  for (const overrideTile of overrideTiles) {
    const existingIndex = map.findIndex(tile => (
      tile.placement.position.x === overrideTile.placement.position.x &&
      tile.placement.position.y === overrideTile.placement.position.y
    ))

    if (existingIndex !== -1) {
      map[existingIndex] = mergeDeep(map[existingIndex], overrideTile)
    } else {
      map.push(overrideTile)
    }
  }

  return map
}
