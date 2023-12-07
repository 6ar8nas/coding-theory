import { GolayBase } from './golay-base';
import { splitToSubstrings, multiplyVectorToMatrix } from '../utils';

/** Class responsible for vector encoding using Golay C23 code. */
export class GolayEncoder extends GolayBase {
    /** The number of characters needed to succesfully encode the word. */
    public static readonly codeLength = 12;

    /** Dynamically initialized generator matrix. */
    private readonly _generatorMatrix: number[][];

    constructor() {
        super();
        // Horizontal matrices concatenation, after the removal of the last bMatrix column.
        this._generatorMatrix = this._identityMatrix.map((row, index) =>
            row.concat(GolayBase._bMatrix[index].slice(0, -1)),
        );
    }

    /** Encodes a long binary string value using Golay code C23.
     * @param value Binary value to be encoded.
     * @returns Encoded binary value.
     */
    public encode = (value: string): string => {
        return splitToSubstrings(value, GolayEncoder.codeLength) // splitting the initial value into substrings of length 12.
            .map(x => {
                const substring = x.padEnd(GolayEncoder.codeLength, '0'); // appends zeros to match the code length for each substring.
                return multiplyVectorToMatrix(substring, this._generatorMatrix); // multiplying each substring with the generator matrix.
            })
            .join(''); // making a single string from the encoded substrings.
    };
}
