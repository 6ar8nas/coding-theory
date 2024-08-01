import { expect, describe, it } from 'vitest';
import { addVectors, joinVectors, calculateVectorWeight, multiplyVectorToMatrix, generateVector } from './vector-utils';

describe(addVectors.name, () => {
    it.each([
        { vec1: '11011011', vec2: '01100010', expected: '10111001' },
        { vec1: '163477', vec2: '528861', expected: '681238', base: 10 },
        { vec1: '8ab412f1', vec2: 'fa12cd4f', expected: '74c6df30', base: 16 },
    ])('adds vectors $vec1 and $vec2 in base $base', ({ vec1, vec2, expected, base }) => {
        expect(addVectors(vec1, vec2, base)).to.equal(expected);
    });

    it('throws when vectors are of different lengths', () => {
        expect(() => addVectors('10111', '1')).to.throw(Error, 'The lengths of the strings do not match');
    });

    it('throws when vector includes invalid base numbers', () => {
        expect(() => addVectors('1311', '4122', 3)).to.throw(Error, 'Invalid character 4 for base 3.');
    });
});

describe(joinVectors.name, () => {
    it('joins two binary vectors', () => {
        expect(joinVectors('10110111', '01101010')).to.equal('1011011101101010');
    });
});

describe(calculateVectorWeight.name, () => {
    it.each([
        { vec: '110110101', expected: 6 },
        { vec: '12b121f01042', expected: 10 },
        { vec: '', expected: 0 },
    ])('finds the weight of vector $vec', ({ vec, expected }) => {
        expect(calculateVectorWeight(vec)).to.equal(expected);
    });
});

describe(multiplyVectorToMatrix.name, () => {
    it.each([
        {
            vec: '10',
            matrix: [
                [1, 1, 0],
                [0, 1, 1],
            ],
            expected: '110',
        },
        {
            vec: '4121',
            matrix: [
                [5, 3, 4],
                [4, 6, 7],
                [1, 2, 4],
                [2, 1, 5],
            ],
            base: 10,
            expected: '836',
        },
    ])('multiplies vector $vec to matrix $matrix under base $base', ({ vec, matrix, base, expected }) => {
        expect(multiplyVectorToMatrix(vec, matrix, base)).to.deep.equal(expected);
    });

    it('throws when vectors are of different lengths', () => {
        expect(() => multiplyVectorToMatrix('10111', [[2, 0]])).to.throw(
            Error,
            "Vector's length does not match matrix's height.",
        );
    });

    it('throws when vector includes invalid base numbers', () => {
        expect(() =>
            multiplyVectorToMatrix(
                '13',
                [
                    [1, 1, 0],
                    [0, 1, 0],
                ],
                2,
            ),
        ).to.throw(Error, 'Invalid character 3 for base 2.');
    });
});

describe(generateVector.name, () => {
    it.each([
        { fill: '1', length: 5, expected: '11111' },
        { fill: '10', length: 7, transforms: [], expected: '1010101' },
        { fill: '0', length: 5, transforms: [{ index: 3, character: '2' }], expected: '00020' },
    ])(
        'generates vector like $fill of length $length with transformations $transforms',
        ({ fill, length, transforms, expected }) => {
            expect(generateVector(fill, length, transforms)).to.equal(expected);
        },
    );
});
