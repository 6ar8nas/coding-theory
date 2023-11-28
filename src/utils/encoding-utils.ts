import { splitToSubstrings } from '.';

// The number of characters needed to succesfully encode the word.
export const encodingCodeLength = 1;

/** Encodes a long binary string value using Golay's code C23.
 * @param {string} value A binary value to be encoded.
 */
export const encode = (value: string): string => {
    return splitToSubstrings(value, encodingCodeLength)
        .map(x => {
            const substring = x.padEnd(encodingCodeLength, '0');
            return encodeFn(substring);
        })
        .join('');
};

/** Encodes a single binary vector using Golay's code C23.
 * @param {string} value A binary value of 'encodingCodeLength' characters to be encoded.
 */
const encodeFn = (value: string): string => {
    if (value === '0') return '000';
    return '111';
};

/** Counts how many characters were padded during encoding to match Golay's code 23 specifications.
 * @param {string} initialValue A binary value that was encoded.
 */
export const countPaddedCharacters = (initialValue: string) =>
    encodingCodeLength - (initialValue.length % encodingCodeLength);
