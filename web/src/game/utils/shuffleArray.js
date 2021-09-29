export function shuffleArray(array) {
    const result = []
    const source = [...array]

    while (source.length) {
        const index = Math.floor(Math.random() * source.length)
        result.push(source[index])
        source.splice(index, 1)
    }

    return result
}
