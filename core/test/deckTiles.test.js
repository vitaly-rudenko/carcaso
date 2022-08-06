import { expect } from 'chai'
import { parseDeckTile, deckTiles } from '../src/deckTiles.js'

describe('[deckTiles]', () => {
    describe('parseDeckTile()', () => {
        it('should parse simple tiles', () => {
            expect(
                parseDeckTile(`
                    _f_
                    fff x1
                    _f_
                `)
            ).to.deep.eq({
                pattern: 'fffff',
                count: 1,
            })

            expect(
                parseDeckTile(`
                    _f_
                    fmf x2
                    _f_
                `)
            ).to.deep.eq({
                pattern: 'ffmff',
                count: 2,
            })
        })

        it('should parse complex tiles', () => {
            expect(
                parseDeckTile(`
                    _w_
                    rrw x5
                    _r_
                `)
            ).to.deep.eq({
                pattern: 'wrrwr',
                count: 5,
            })

            expect(
                parseDeckTile(`
                    _c_
                    rac x9
                    _r_
                `)
            ).to.deep.eq({
                pattern: 'cracr',
                count: 9,
            })
        })
    })

    it('should contain valid tiles', () => {
        expect(deckTiles.every(tile => Number.isInteger(tile.count) && tile.count > 0), 'valid count')
            .to.be.true
        
        expect(deckTiles.every(tile => typeof tile.pattern === 'string' && tile.pattern.length === 5), 'valid pattern')
            .to.be.true
    })

    it('should contain 84 tiles in total', () => {
        function count(tiles) {
            return tiles
                .map(tile => tile.count)
                .reduce((acc, curr) => acc + curr, 0)
        }

        const withRiver = count(deckTiles.filter(tile => tile.pattern.includes('w')))
        const withoutRiver = count(deckTiles.filter(tile => !tile.pattern.includes('w')))
        const withCoatOfArms = count(deckTiles.filter(tile => tile.pattern.includes('a')))
        const withMonasteries = count(deckTiles.filter(tile => tile.pattern.includes('m')))

        expect(withoutRiver, 'without river').to.eq(72)
        expect(withRiver, 'with river').to.eq(12)
        expect(withCoatOfArms, 'with coat of arms').to.eq(10)
        expect(withMonasteries, 'with monasteries').to.eq(7)
    })

    it('should contain unique tiles', () => {
        expect(
            deckTiles.every(
                (t1, i) => deckTiles.every(
                    (t2, j) => i === j || t1.pattern !== t2.pattern
                )
            )
        ).to.be.true
    })
})
