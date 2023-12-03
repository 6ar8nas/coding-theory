import { validateBinary } from '.';

/** Converts text to binary.
 * @param value Input UTF-8 string to be converted to a binary string.
 * @returns Binary string representation of the text input value.
 */
export const convertTextToBinary = (value: string): string => {
    return value
        .split('')
        .map(
            char =>
                char
                    .charCodeAt(0) // Return the unicode value of the character
                    .toString(2) // Convert the number to a binary string representation
                    .padStart(8, '0'), // Prepend zeros till it has a length of 8.
        )
        .join('');
};

/** Converts binary to text.
 * @param value Input binary string to be converted to a UTF-8 string.
 * @throws if the value is an invalid binary string expression.
 * @returns UTF-8 string representation of the binary input value.
 */
export const convertBinaryToText = (value: string): string => {
    if (!validateBinary(value)) throw new Error('Received an unexpected non-binary string.');

    const binaryArray = value.match(/.{1,8}/g) || []; // Split binary string into 8-bit substrings using RegEx.
    return (
        binaryArray
            // Parse a binary number to decimal and match it to a UTF-8 character.
            .map(binarySubstring => String.fromCharCode(parseInt(binarySubstring, 2)))
            .join('')
    );
};

/** Splits a string into substrings of param 'length' characters.
 * @param value Input string to be divided.
 * @param length Length of each substring.
 * @returns Array of substrings of the designated length.
 */
export const splitToSubstrings = (value: string, length: number): string[] => {
    const substrings: string[] = [];
    for (let i = 0, charsLength = value.length; i < charsLength; i += length) {
        substrings.push(value.slice(i, i + length));
    }
    return substrings;
};
