import { describe, expect, it } from 'vitest';
import { compareBinaryStringsExclusiveOr, validateBinary } from './binary-utils';

describe(validateBinary.name, () => {
    it.each(['10110', '0', '1', ''])('returns true for a valid binary string %s', (input: string) => {
        expect(validateBinary(input)).to.equal(true);
    });

    it.each(['abc', '1020', '0101001a01'])('returns false for an invalid binary string %s', (input: string) => {
        expect(validateBinary(input)).to.equal(false);
    });
});

describe(compareBinaryStringsExclusiveOr.name, () => {
    it.each([
        { vec1: '101000', vec2: '011101', expected: '110101' },
        { vec1: '0000', vec2: '0000', expected: '0000' },
        { vec1: '1111', vec2: '0000', expected: '1111' },
    ])('returns XOR result for binary strings $vec1 and $vec2', ({ vec1, vec2, expected }) => {
        expect(compareBinaryStringsExclusiveOr(vec1, vec2)).to.equal(expected);
    });

    it('throws if either string is not a valid binary string', () => {
        expect(() => compareBinaryStringsExclusiveOr('1010', '1020')).to.throw(
            Error,
            'Received an unexpected non-binary string.',
        );
    });

    it('throws if binary strings have different lengths', () => {
        expect(() => compareBinaryStringsExclusiveOr('1010', '010')).to.throw(
            Error,
            'The lengths of the strings do not match.',
        );
    });
});
