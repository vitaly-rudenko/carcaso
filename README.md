# Carcaso Online

## Basic entities & interfaces

```ts
interface DeckTile {
  pattern: string
  count: number
}

interface Tile {
  pattern: string
  placement: Placement
  meeple?: Meeple
}

interface Meeple {
  owner: 'red' | 'green' | 'blue' | 'yellow' | 'black'
  position: Position
}

interface Placement {
  position: Position
  rotation: 0 | 1 | 2 | 3
}

interface Blob {
  feature: Feature
  positions: Position[]
}
```
