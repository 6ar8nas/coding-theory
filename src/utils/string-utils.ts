/** Converts text to binary.
 * @param {string} value Input UTF-8 string to be converted to a binary string.
 */
export const convertTextToBinary = (value: string): string => {
    return value
        .split('')
        .map(
            char =>
                char
                    .charCodeAt(0) // returns the unicode value of the character
                    .toString(2) // converts the number to a binary string representation
                    .padStart(8, '0'), // prepends zeros till it has a length of 8.
        )
        .join('');
};

/** Converts binary to text.
 * @param {string} value Input binary string to be converted to a UTF-8 string.
 * @throws if the value is an invalid binary string expression.
 */
export const convertBinaryToText = (value: string): string => {
    if (!validateBinary(value)) throw new Error('Received an unexpected non-binary string.');

    const binaryArray = value.match(/.{1,8}/g) || []; // splits binary string into 8-bit substrings using RegEx.
    return (
        binaryArray
            // parses a binary number to decimal and matches it to a UTF-8 character.
            .map(binarySubstring => String.fromCharCode(parseInt(binarySubstring, 2)))
            .join('')
    );
};

/** Validates whether a given string is a binary number.
 * @param {string} value Value to be validated.
 */
export const validateBinary = (value: string): boolean => {
    return /^[0-1]*$/.test(value); // checks the value against a RegEx pattern.
};

/** Compares two binary strings to one another and returns a logical XOR result.
 * @param {string} valueA Binary string value to be compared to another.
 * @param {string} valueB Binary string value to be compared to another.
 * @throws if the parameters are non-binary strings.
 * @throws if the parameters are of non-matching lengths.
 */
export const compareBinaryStringsExclusiveOr = (valueA: string, valueB: string): string => {
    if (!validateBinary(valueA) || !validateBinary(valueB))
        throw new Error('Received an unexpected non-binary string.');
    if (valueA.length !== valueB.length) throw new Error('The length of the strings does not match.');

    return valueA
        .split('')
        .map((charA, index) => (charA === valueB[index] ? '0' : '1'))
        .join('');
};

/** Splits a string into substrings of param 'length' characters.
 * @param {string} value Input string to be divided.
 * @param {number} length Length of each substring.
 */
export const splitToSubstrings = (value: string, length: number): string[] => {
    const substrings: string[] = [];
    for (let i = 0, charsLength = value.length; i < charsLength; i += length) {
        substrings.push(value.slice(i, i + length));
    }
    return substrings;
};
