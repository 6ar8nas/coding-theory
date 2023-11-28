import { splitToSubstrings } from '.';

// The number of characters needed to succesfully decode the word.
export const decodingCodeLength = 3;

/** Decodes a long binary string value using 3.7.1. example's algorithm (p. 88).
 * @param {string} value A binary value to be decoded.
 */
export const decode = (value: string): string => {
    const substrings = splitToSubstrings(value, decodingCodeLength);
    return substrings.map(x => decodeFn(x)).join('');
};

/** Decodes a single binary vector using 3.7.1. example's algorithm (p. 88).
 * @param {string} value A binary value of 'decodingCodeLength' characters to be decoded.
 */
const decodeFn = (value: string): string => {
    switch (value) {
        case '111':
        case '101':
        case '110':
        case '011':
            return '1';
        case '000':
        case '001':
        case '010':
        case '100':
            return '0';
        default:
            throw new Error('Decoding function encountered unexpected arguments. Terminating.');
    }
};
