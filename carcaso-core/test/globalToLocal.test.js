import { expect } from 'chai'
import { globalToLocal } from '../src/globalToLocal.js'

describe('globalToLocal()', () => {
    it('should convert global position to local (positive coordinates)', () => {
        expect(
            globalToLocal({ x: 0, y: 0 })
        ).to.deep.eq({
            tilePosition: { x: 0, y: 0 },
            featurePosition: { x: 0, y: 0 }
        })

        expect(
            globalToLocal({ x: 4, y: 4 })
        ).to.deep.eq({
            tilePosition: { x: 0, y: 0 },
            featurePosition: { x: 4, y: 4 }
        })

        expect(
            globalToLocal({ x: 5, y: 5 })
        ).to.deep.eq({
            tilePosition: { x: 1, y: 1 },
            featurePosition: { x: 0, y: 0 }
        })

        expect(
            globalToLocal({ x: 7, y: 7 })
        ).to.deep.eq({
            tilePosition: { x: 1, y: 1 },
            featurePosition: { x: 2, y: 2 }
        })

        expect(
            globalToLocal({ x: 9, y: 9 })
        ).to.deep.eq({
            tilePosition: { x: 1, y: 1 },
            featurePosition: { x: 4, y: 4 }
        })
    })

    it('should convert global position to local (negative coordinates)', () => {
        expect(
            globalToLocal({ x: -1, y: -1 })
        ).to.deep.eq({
            tilePosition: { x: -1, y: -1 },
            featurePosition: { x: 4, y: 4 }
        })

        expect(
            globalToLocal({ x: -5, y: -5 })
        ).to.deep.eq({
            tilePosition: { x: -1, y: -1 },
            featurePosition: { x: 0, y: 0 }
        })

        expect(
            globalToLocal({ x: -7, y: -7 })
        ).to.deep.eq({
            tilePosition: { x: -2, y: -2 },
            featurePosition: { x: 3, y: 3 }
        })

        expect(
            globalToLocal({ x: -11, y: -11 })
        ).to.deep.eq({
            tilePosition: { x: -3, y: -3 },
            featurePosition: { x: 4, y: 4 }
        })
    })

    it('should convert global position to local (mixed coordinates)', () => {
        expect(
            globalToLocal({ x: -1, y: 1 })
        ).to.deep.eq({
            tilePosition: { x: -1, y: 0 },
            featurePosition: { x: 4, y: 1 }
        })

        expect(
            globalToLocal({ x: 5, y: -5 })
        ).to.deep.eq({
            tilePosition: { x: 1, y: -1 },
            featurePosition: { x: 0, y: 0 }
        })

        expect(
            globalToLocal({ x: -7, y: 7 })
        ).to.deep.eq({
            tilePosition: { x: -2, y: 1 },
            featurePosition: { x: 3, y: 2 }
        })

        expect(
            globalToLocal({ x: 11, y: -11 })
        ).to.deep.eq({
            tilePosition: { x: 2, y: -3 },
            featurePosition: { x: 1, y: 4 }
        })
    })
});
