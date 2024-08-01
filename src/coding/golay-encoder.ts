import { GolayCommon } from './golay-common';
import { splitToSubstrings, multiplyVectorToMatrix, validateBinary } from '../utils';

/** Golay C23 vector encoder. */
export class GolayEncoder extends GolayCommon {
    /** The number of characters needed to succesfully encode the word. */
    public static readonly codeLength = 12;

    /** Generator matrix for the Golay C23 code.
     * Per definition, it is the identity matrix concatenated horizontally with bMatrix (having its last column sliced). */
    private static readonly generatorMatrix: number[][] = GolayCommon.identityMatrix.map((row, index) =>
        row.concat(GolayCommon.bMatrix[index].slice(0, -1)),
    );

    /** Encodes a long binary string value using Golay code C23.
     * @param value Binary value to be encoded.
     * @throws if the value is an invalid binary string expression.
     * @returns Encoded binary value.
     */
    public encode = (value: string): string => {
        if (!validateBinary(value)) throw new Error('Received an unexpected non-binary string.');

        return splitToSubstrings(value, GolayEncoder.codeLength)
            .map(x => {
                const substring = x.padEnd(GolayEncoder.codeLength, '0'); // appends zeros to match the code length for each substring.
                return multiplyVectorToMatrix(substring, GolayEncoder.generatorMatrix);
            })
            .join('');
    };
}
