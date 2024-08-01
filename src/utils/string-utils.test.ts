import { describe, it, expect } from 'vitest';
import { convertTextToBinary, convertBinaryToText, splitToSubstrings, parseIntStrict } from './string-utils';

describe(convertTextToBinary.name, () => {
    it.each([
        { input: 'A', expected: '0000000001000001' },
        {
            input: 'hello',
            expected: '00000000011010000000000001100101000000000110110000000000011011000000000001101111',
        },
    ])('converts text $input to a binary string', ({ input, expected }) => {
        expect(convertTextToBinary(input)).to.equal(expected);
    });
});

describe(convertBinaryToText.name, () => {
    it.each([
        { input: '0000000001000001', expected: 'A' },
        {
            input: '00000000011010000000000001100101000000000110110000000000011011000000000001101111',
            expected: 'hello',
        },
    ])('converts binary string $input to text', ({ input, expected }) => {
        expect(convertBinaryToText(input)).to.equal(expected);
    });

    it.each(['invalidBinary', '00000002'])("throws for invalid binary string '%s'", (binaryString: string) => {
        expect(() => convertBinaryToText(binaryString)).to.throw(Error, 'Received an unexpected non-binary string.');
    });
});

describe(splitToSubstrings.name, () => {
    it.each([
        { input: 'porsche', length: 2, expected: ['po', 'rs', 'ch', 'e'] },
        { input: 'porsche', length: 2, expected: ['po', 'rs', 'ch', 'e'] },
        { input: 'mclaren', length: 10, expected: ['mclaren'] },
        { input: '', length: 6, expected: [] },
    ])('splits string $input into substrings of length $length', ({ input, length, expected }) => {
        expect(splitToSubstrings(input, length)).to.deep.equal(expected);
    });
});

describe(parseIntStrict.name, () => {
    it.each([
        { value: 'B', base: 16, expected: 11 },
        { value: '7', base: 10, expected: 7 },
        { value: '1', base: 2, expected: 1 },
    ])('parses character $value as an integer in base $base', ({ value, base, expected }) => {
        expect(parseIntStrict(value, base)).to.equal(expected);
    });

    it('throws on invalid characters for the given base', () => {
        expect(() => parseIntStrict('3', 2)).to.throw(Error, 'Invalid character 3 for base 2.');
    });

    it('throw if the input is not a single character', () => {
        expect(() => parseIntStrict('AB', 16)).to.throw(Error, "Input must be a single character. Received: 'AB'");
    });
});
