import { GolayBase } from './golay-base';
import {
    addVectors,
    calculateVectorWeight,
    generateVector,
    joinVectors,
    splitToSubstrings,
    multiplyVectorToMatrix,
} from '../utils';

/** Class responsible for vector decoding using Golay C23 code. */
export class GolayDecoder extends GolayBase {
    /** The number of characters needed to succesfully decode the word. */
    public static readonly codeLength = 23;

    /** Dynamically initialized control matrix. */
    private readonly _controlMatrix: number[][];

    constructor() {
        super();
        // Vertical matrices concatenation.
        this._controlMatrix = this._identityMatrix.concat(GolayBase._bMatrix);
    }

    /** Decodes a long binary string value using IMLD for the Golay code C23.
     * @param value A binary value to be decoded.
     * @returns Decoded long binary value.
     */
    public decode = (value: string): string => {
        const substrings = splitToSubstrings(value, GolayDecoder.codeLength); // splitting the initial value into substrings of length 23.
        return substrings.map(x => this.decodeFn(x)).join(''); // decoding each substring and mapping them to a single string.
    };

    /** Decodes a single binary vector using IMLD for the Golay code C23.
     * @param value A binary vector of 23 characters to be decoded.
     * @returns Decoded single binary vector of 12 characters.
     */
    private decodeFn = (value: string): string => {
        const word24 = joinVectors(value, calculateVectorWeight(value) % 2 === 1 ? '0' : '1'); // 3.7.1 1)
        const errorVector = this.findErrorVector(word24); // 3.7.1 2)
        const errorVectorTrimmed = errorVector.slice(0, -1); // 3.7.1 3)
        const codeword = addVectors(value, errorVectorTrimmed); // v = w + u
        return codeword.slice(0, 12); // taking only the initial 12 characters of the codeword
    };

    /** This functions finds an error vector for Golay C24 codeword.
     * @param value A binary value of 24 characters to be decoded using C24 decoding algorithm.
     * @returns Single vector's of 24 characters error vector.
     */
    private findErrorVector = (value: string): string => {
        const firstSyndrome = multiplyVectorToMatrix(value, this._controlMatrix); // 3.6.1 1)
        const firstSyndromeErrorVector = this.findSyndromeErrorVector(firstSyndrome); // 3.6.1 2-3)
        if (firstSyndromeErrorVector) return joinVectors(firstSyndromeErrorVector[0], firstSyndromeErrorVector[1]);

        const secondSyndrome = multiplyVectorToMatrix(firstSyndrome, GolayBase._bMatrix); // 3.6.1 4)
        const secondSyndromeErrorVector = this.findSyndromeErrorVector(secondSyndrome)!; // 3.6.1 5-6)
        return joinVectors(secondSyndromeErrorVector[1], secondSyndromeErrorVector[0]);
    };

    /** This function aims to find a syndrome error vector pieces for C24 error vector construction.
     * @param syndrome A 12 length syndrome binary vector.
     * @returns A pair of 12 length binary vectors or undefined if no error vector was found.
     */
    private findSyndromeErrorVector = (syndrome: string): [string, string] | undefined => {
        const syndromeWeight = calculateVectorWeight(syndrome); // 3.6.1 2) or 5)
        if (syndromeWeight <= 3) return [syndrome, generateVector('0', 12)]; // u = [syndrome, 0] or [0, syndrome]

        let result: [string, string] | undefined = undefined;
        GolayBase._bMatrix.forEach((row, index) => {
            const rowVector = addVectors(syndrome, row.join(''));
            const vectorWeight = calculateVectorWeight(rowVector); // 3.6.1. 3) or 6)
            if (vectorWeight <= 2) {
                // u = [syndrome + row, 0 + e_index] or [0 + e_index,syndrome + row]
                result = [rowVector, generateVector('0', 12, [{ index, character: '1' }])];
            }
        });
        return result;
    };
}
