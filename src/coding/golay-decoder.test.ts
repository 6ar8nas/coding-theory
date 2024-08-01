import { describe, expect, it } from 'vitest';
import { GolayDecoder } from './golay-decoder';
import { GolayEncoder } from './golay-encoder';

describe(GolayDecoder.name, () => {
    const decoder = new GolayDecoder();

    it.each([
        { vec: '10111110111101001001001', expected: '001111101110' }, // vec = w0, wt(s) <= 3 for s
        { vec: '00100100110110100010100', expected: '001001011111' }, // vec = w0, wt(s + b_5) <= 2 for sB
        { vec: '00011100011101101101000', expected: '000011000111' }, // vec = w0, wt(sB + b_4) <= 2 for sB
        { vec: '00101000100111111100000', expected: '001010000101' }, // vec = w1, wt(sB + b_11) <= 2 for s
    ])('decodes a 23-bit vector $vec', ({ vec, expected }) => {
        const decodedValue = decoder.decode(vec);

        expect(decodedValue).to.have.length(12);
        expect(decodedValue).to.equal(expected);
    });

    it('throws if the input value is not a binary string', () => {
        expect(() => decoder.decode('10111112111101001001001')).to.throw(
            Error,
            'Received an unexpected non-binary string.',
        );
    });

    it('throws if the input value length is not a multiple of 23', () => {
        expect(() => decoder.decode('101')).to.throw(
            Error,
            'Binary string length must be a multiple of the Golay code length.',
        );
    });

    describe('Dogfooding', () => {
        const encoder = new GolayEncoder();

        it.each([
            '10101',
            '000011000110',
            '1010111010101011101011',
            '101011101010',
            '111011110111010111101011',
            '000000000000000000000000000',
            '1111111111111111',
        ])('decodes recently encoded vector %s', (vector: string) => {
            const encodedValue = encoder.encode(vector);

            const decodedValue = decoder.decode(encodedValue);

            expect(decodedValue.substring(0, vector.length)).to.equal(vector);
        });
    });
});
