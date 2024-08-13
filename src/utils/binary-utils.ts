/** Validates whether a given string is a binary number.
 * @param value String to be validated.
 * @returns True if the value is a binary number represented as a string, false otherwise.
 */
export const validateBinary = (value: string): boolean => {
    return /^[0-1]*$/.test(value);
};

/** Compares two binary strings to one another and returns a logical XOR result.
 * @param valueA Binary string value to be compared to another.
 * @param valueB Binary string value to be compared to another.
 * @throws if the arguments are non-binary strings.
 * @throws if the arguments are of non-matching lengths.
 * @returns Logical XOR result of the two binary strings.
 */
export const compareBinaryStringsExclusiveOr = (valueA: string, valueB: string): string => {
    if (!validateBinary(valueA) || !validateBinary(valueB))
        throw new Error('Received an unexpected non-binary string.');
    if (valueA.length !== valueB.length) throw new Error('The lengths of the strings do not match.');

    return valueA
        .split('')
        .map((charA, index) => (charA === valueB[index] ? '0' : '1'))
        .join('');
};
