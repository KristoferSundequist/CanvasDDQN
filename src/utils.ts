export const Range = (n: number): number[] => [...Array(n).keys()]

export const Sum = (arr: number[]): number => arr.reduce((sum, v) => sum + v, 0)

export const Average = (arr: number[]): number => Sum(arr) / arr.length
