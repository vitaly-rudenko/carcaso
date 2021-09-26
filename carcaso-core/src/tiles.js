export const TileFeature = {
    FIELD: 'f',
    ROAD: 'r',
    CITY: 'c',
    RIVER: 'w',
    MONASTERY: 'm',
    COAT_OF_ARMS: 'a',
}

// cities x roads

export function parseTile(serialized) {
    const rows = serialized
        .split('\n')
        .map(row => row.trim())
        .filter(Boolean)
    const top = rows[0][1]
    const [middle, metadata] = rows[1].split(' ')
    const bottom = rows[2][1]

    const count = Number(metadata.slice(1))

    return {
        pattern: top + middle + bottom,
        count,
    }
}

export const tiles = [
    // --- non-river tiles
    // 0x0
    `
    _f_
    fmf x4
    _f_`,
    // 1x0
    `
    _c_
    fff x5
    _f_`,
    // 2x0
    `
    _f_
    ccc x1
    _f_`,
    `
    _f_
    cac x2
    _f_`,
    `
    _c_
    fcc x3
    _f_`,
    `
    _c_
    fac x2
    _f_`,
    `
    _c_
    fff x3
    _c_`,
    `
    _c_
    ffc x2
    _f_`,
    // 3x0
    `
    _c_
    ccc x3
    _f_`,
    `
    _c_
    cac x1
    _f_`,
    // 4x0
    `
    _c_
    cac x1
    _c_`,
    // 0x1
    `
    _f_
    fmf x2
    _r_`,
    // 3x1
    `
    _c_
    ccc x1
    _r_`,
    `
    _c_
    cac x2
    _r_`,
    // 0x2
    `
    _f_
    rrr x8
    _f_`,
    `
    _f_
    rrf x9
    _r_`,
    // 1x2
    `
    _c_
    rrr x4
    _f_`,
    `
    _c_
    rrf x3
    _r_`,
    `
    _c_
    frr x3
    _r_`,
    // 2x2
    `
    _c_
    rcc x3
    _r_`,
    `
    _c_
    rac x2
    _r_`,
    // 0x3
    `
    _f_
    rrr x4
    _r_`,
    // 1x3
    `
    _c_
    rrr x3
    _r_`,
    // 0x4
    `
    _r_
    rrr x1
    _r_`,
    // --- rivers
    // 0x0
    `
    _f_
    fwf x2
    _w_`,
    `
    _f_
    www x2
    _f_`,
    `
    _f_
    wwf x2
    _w_`,
    // 2x0
    `
    _c_
    www x1
    _c_`,
    `
    _c_
    wcc x1
    _w_`,
    // 0x1
    `
    _f_
    wmw x1
    _f_`,
    // 1x1
    `
    _c_
    wrw x1
    _r_`,
    // 0x2
    `
    _r_
    wrw x1
    _r_`,
    `
    _r_
    wrr x1
    _w_`,
].map(serialized => parseTile(serialized))
