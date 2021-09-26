import { expect } from 'chai'
import { parseTile, tiles } from '../src/tiles.js'

describe('tiles', () => {
    describe('parseTile()', () => {
        it('should parse simple tiles', () => {
            expect(
                parseTile(`
                    _f_
                    fff x1
                    _f_
                `)
            ).to.deep.eq({
                pattern: 'fffff',
                count: 1,
            })

            expect(
                parseTile(`
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
                parseTile(`
                    _w_
                    rrw x5
                    _r_
                `)
            ).to.deep.eq({
                pattern: 'wrrwr',
                count: 5,
            })

            expect(
                parseTile(`
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
        expect(tiles.every(tile => Number.isInteger(tile.count) && tile.count > 0), 'valid count')
            .to.be.true
        
        expect(tiles.every(tile => typeof tile.pattern === 'string' && tile.pattern.length === 5), 'valid pattern')
            .to.be.true
    })

    it('should contain 84 tiles in total', () => {
        function count(tiles) {
            return tiles
                .map(tile => tile.count)
                .reduce((acc, curr) => acc + curr, 0)
        }

        const withRiver = count(tiles.filter(tile => tile.pattern.includes('w')))
        const withoutRiver = count(tiles.filter(tile => !tile.pattern.includes('w')))

        expect(withoutRiver).to.eq(72)
        expect(withRiver).to.eq(12)
    })
})
