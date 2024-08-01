import { validateBinary } from '.';

/** Converts text to binary.
 * @param value Input UTF-16 string to be converted to a binary string.
 * @returns Binary string representation of the text input value.
 */
export const convertTextToBinary = (value: string): string => {
    return value
        .split('')
        .map(
            char =>
                char
                    .charCodeAt(0) // Return the unicode value of the character
                    .toString(2)
                    .padStart(16, '0'), // Prepend zeros till it has a length of 16.
        )
        .join('');
};

/** Converts binary to text.
 * @param value Input binary string to be converted to a UTF-16 string.
 * @throws if the value is an invalid binary string expression.
 * @returns UTF-16 string representation of the binary input value.
 */
export const convertBinaryToText = (value: string): string => {
    if (!validateBinary(value)) throw new Error('Received an unexpected non-binary string.');

    const binaryArray = value.match(/.{1,16}/g) || []; // Split binary string into 16-bit substrings.
    return (
        binaryArray
            // Parse a binary number to decimal and match it to a UTF-16 character.
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

/** Parses a character as an integer in a given base and throws an error if parsing fails.
 * @param char The character to be parsed as an integer.
 * @param base The radix to be used for parsing the character.
 * @throws if the input cannot be parsed as an integer in the given base.
 * @throws if the input is not a single character.
 * @returns The integer value of the character in the specified base.
 */
export const parseIntStrict = (char: string, base: number): number => {
    if (char.length !== 1) throw new Error(`Input must be a single character. Received: '${char}'`);

    const integer = parseInt(char, base);
    if (isNaN(integer)) throw new Error(`Invalid character ${char} for base ${base}.`);

    return integer;
};
