export function range(start, stop, step = 1): number[] {
    const a = [start]
    let b = start
    while (b < stop) {
        a.push(b += step)
    }
    return a
}