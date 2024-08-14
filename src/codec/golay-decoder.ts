import { GolayCommon } from './golay-common';
import {
    addVectors,
    calculateVectorWeight,
    generateVector,
    joinVectors,
    splitToSubstrings,
    multiplyVectorToMatrix,
    validateBinary,
} from '../utils';

/** Golay C23 code vector decoder. */
export class GolayDecoder extends GolayCommon {
    /** Golay C23 expected word length for decoding. */
    public static readonly codeLength = 23;

    /** Control matrix for the Golay C23 code.
     * Per definition, it is the identity matrix concatenated with the bMatrix vertically. */
    private static readonly controlMatrix: number[][] = GolayCommon.identityMatrix.concat(GolayCommon.bMatrix);

    /** Decodes a long binary string value using IMLD for the Golay code C23.
     * @param value A binary value to be decoded.
     * @throws if the value is an invalid binary string expression.
     * @throws if the value length is not a multiple of the Golay code length.
     * @returns Decoded long binary value.
     */
    public decode = (value: string): string => {
        if (!validateBinary(value)) throw new Error('Received an unexpected non-binary string.');
        if (value.length % GolayDecoder.codeLength !== 0)
            throw new Error('Binary string length must be a multiple of the Golay code length.');

        const substrings = splitToSubstrings(value, GolayDecoder.codeLength);
        return substrings.map(x => this.decodeFn(x)).join('');
    };

    /** Decodes a single binary vector using IMLD for the Golay code C23.
     * @param value A binary vector of 23 characters to be decoded.
     * @returns Decoded single binary vector of 12 characters.
     */
    private decodeFn = (value: string): string => {
        const word24 = joinVectors(value, calculateVectorWeight(value) % 2 === 1 ? '0' : '1'); // Appending a character to make the vector's weight be odd.
        const errorVector = this.findErrorVector(word24); // Using Golay C24 code decoding algorithm to find the error vector.
        const errorVectorTrimmed = errorVector.slice(0, -1); // Removing the last appended character.
        const codeword = addVectors(value, errorVectorTrimmed); // v = w + u
        return codeword.slice(0, 12); // taking only the initial 12 characters of the codeword
    };

    /** Finds an error vector for Golay C24 codeword.
     * @param value A binary value of 24 characters to be decoded using C24 decoding algorithm.
     * @returns Single vector's of 24 characters error vector.
     */
    private findErrorVector = (value: string): string => {
        const firstSyndrome = multiplyVectorToMatrix(value, GolayDecoder.controlMatrix); // s = wH
        const firstSyndromeErrorVector = this.findSyndromeErrorVector(firstSyndrome);
        if (firstSyndromeErrorVector) return joinVectors(firstSyndromeErrorVector[0], firstSyndromeErrorVector[1]); // u = [s, 0] || u = [s + b_i, e_i]

        const secondSyndrome = multiplyVectorToMatrix(firstSyndrome, GolayCommon.bMatrix); // sB
        const secondSyndromeErrorVector = this.findSyndromeErrorVector(secondSyndrome)!; // as we use Golay C23, the second syndrome will always result in a decoded word
        return joinVectors(secondSyndromeErrorVector[1], secondSyndromeErrorVector[0]); // u = [0, sB] || [e_i, sB + b_i]
    };

    /** Attempts finding a syndrome error vector pieces for C24 error vector construction.
     * @param syndrome A 12 length syndrome binary vector.
     * @returns A pair of 12 length binary vectors or undefined if no error vector was found.
     */
    private findSyndromeErrorVector = (syndrome: string): [string, string] | undefined => {
        const syndromeWeight = calculateVectorWeight(syndrome);
        if (syndromeWeight <= 3) return [syndrome, generateVector('0', 12)]; // [syndrome, 0]

        let result: [string, string] | undefined = undefined;
        GolayCommon.bMatrix.forEach((row, index) => {
            const rowVector = addVectors(syndrome, row.join(''));
            const vectorWeight = calculateVectorWeight(rowVector);
            if (vectorWeight <= 2) {
                // [syndrome + b_i, 0 + e_i]
                result = [rowVector, generateVector('0', 12, [{ index, character: '1' }])];
            }
        });
        return result;
    };
}
