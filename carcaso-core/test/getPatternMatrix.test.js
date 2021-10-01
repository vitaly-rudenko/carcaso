import { stripIndent } from 'common-tags'
import { expect } from 'chai'
import { getPatternMatrix } from '../src/getPatternMatrix.js'

describe('getPatternMatrix()', () => {
    it('should generate pattern matrix for simple patterns', () => {
        expect(stringify(getPatternMatrix('fffff'))).to.eq(stripIndent`
            fffff
            fffff
            fffff
            fffff
            fffff
        `)

        expect(stringify(getPatternMatrix('ffmff'))).to.eq(stripIndent`
            fffff
            fmmmf
            fmmmf
            fmmmf
            fffff
        `)
    })

    it('should generate pattern matrix for river patterns', () => {
        expect(stringify(getPatternMatrix('ffwfw'))).to.eq(stripIndent`
            fffff
            fwwwf
            fwwwf
            fwwwf
            ffwff
        `)

        expect(stringify(getPatternMatrix('fwmwf'))).to.eq(stripIndent`
            fffff
            fmmmf
            wmmmw
            fmmmf
            fffff
        `)
    })

    it('should generate pattern matrix for road patterns', () => {
        expect(stringify(getPatternMatrix('rrtrr'))).to.eq(stripIndent`
            ffrff
            ffrff
            rrtrr
            ffrff
            ffrff
        `)

        expect(stringify(getPatternMatrix('rftrr'))).to.eq(stripIndent`
            ffrff
            ffrff
            fftrr
            ffrff
            ffrff
        `)

        expect(stringify(getPatternMatrix('fffrr'))).to.eq(stripIndent`
            fffff
            fffff
            ffffr
            fffrr
            ffrrf
        `)
    })

    it('should generate pattern matrix for city patterns', () => {
        expect(stringify(getPatternMatrix('cffff'))).to.eq(stripIndent`
            bcccb
            fffff
            fffff
            fffff
            fffff
        `)

        expect(stringify(getPatternMatrix('cfffc'))).to.eq(stripIndent`
            bcccb
            fffff
            fffff
            fffff
            bcccb
        `)

        expect(stringify(getPatternMatrix('ccfff'))).to.eq(stripIndent`
            bcccb
            cffff
            cffff
            cffff
            bffff
        `)

        expect(stringify(getPatternMatrix('ccaff'))).to.eq(stripIndent`
            ccccb
            cccff
            ccfff
            cffff
            bffff
        `)

        expect(stringify(getPatternMatrix('fcacf'))).to.eq(stripIndent`
            bfffb
            ccccc
            ccccc
            ccccc
            bfffb
        `)

        expect(stringify(getPatternMatrix('ccacf'))).to.eq(stripIndent`
            ccccc
            ccccc
            ccccc
            ccccc
            bfffb
        `)

        expect(stringify(getPatternMatrix('ccacr'))).to.eq(stripIndent`
            ccccc
            ccccc
            ccccc
            ccccc
            bfrfb
        `)

        expect(stringify(getPatternMatrix('ccacc'))).to.eq(stripIndent`
            ccccc
            ccccc
            ccccc
            ccccc
            ccccc
        `)
    })

    it('should generate pattern matrix for complex patterns', () => {
        expect(stringify(getPatternMatrix('rrccc'))).to.eq(stripIndent`
            frrfb
            rrffc
            rffcc
            ffccc
            bcccc
        `)

        expect(stringify(getPatternMatrix('wcwcw'))).to.eq(stripIndent`
            bfwfb
            cfwfc
            cfwfc
            cfwfc
            bfwfb
        `)

        expect(stringify(getPatternMatrix('wrrcw'))).to.eq(stripIndent`
            ffwfb
            ffwfc
            rrrrc
            ffwfc
            ffwfb
        `)

        expect(stringify(getPatternMatrix('rwrrw'))).to.eq(stripIndent`
            ffrrf
            fffrr
            wfffr
            wwfff
            fwwff
        `)
    })
})

function stringify(matrix) {
    return matrix.map(row => row.join('')).join(`\n`)
}