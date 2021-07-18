export const Range = (n: number): number[] => [...Array(n).keys()]

export const Sum = (arr: number[]): number => arr.reduce((sum, v) => sum + v, 0)

export const Average = (arr: number[]): number => Sum(arr) / arr.length

if (typeof process !== "undefined" && process.env["NODE_ENV"] === "test") {
    describe('utils', () => {
        test('Average gives correct', () => {
            expect(Average([1, 2, 3, 4])).toEqual(2.5)
        })

        test('failer', () => {
            expect(true).toEqual(true)
        })
    })
}

export const RandInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)