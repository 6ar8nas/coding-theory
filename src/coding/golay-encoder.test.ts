import { describe, it, expect } from 'vitest';
import { GolayEncoder } from './golay-encoder';

describe(GolayEncoder.name, () => {
    const encoder = new GolayEncoder();

    it.each([
        { vec: '101101011011', expected: '10110101101100100011000' },
        { vec: '000000000000', expected: '00000000000000000000000' },
        { vec: '111111111111', expected: '11111111111111111111111' },
    ])('encodes a 12-bit binary vector $vec', ({ vec, expected }) => {
        const encodedValue = encoder.encode(vec);

        expect(encodedValue).to.have.length(23);
        expect(encodedValue).to.equal(expected);
    });

    it('encodes a 36-bit binary vector', () => {
        const encodedValue = encoder.encode('101101011011000000000000111111111111');

        expect(encodedValue).to.have.length(69);
        expect(encodedValue).to.equal('101101011011001000110000000000000000000000000011111111111111111111111');
    });

    it('encodes a binary vector consisting of non-multiple of 12 bits', () => {
        const encodedValue = encoder.encode('01011');

        expect(encodedValue).to.have.length(23); // the vector is appended to consist of a nearest multiple of 12 bits, thus the end length is also the full 23
        expect(encodedValue).to.equal('01011000000010011111110');
    });

    it('throws if the input value is not a binary string', () => {
        expect(() => encoder.encode('121210')).to.throw(Error, 'Received an unexpected non-binary string.');
    });
});
