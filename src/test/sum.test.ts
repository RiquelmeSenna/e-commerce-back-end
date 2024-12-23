import { describe, expect, test } from '@jest/globals'

const sum = (a: number, b: number) => {
    return a + b
}

const sub = (a: number, b: number) => {
    return a - b
}

describe('sum module', () => {
    test('add a + b', () => {
        expect(sum(1, 2)).toBe(3)
    });
    test('sub a - b', () => {
        expect(sub(4, 2)).toBe(2)
    })
}) 