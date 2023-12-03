/** Calculates the sum of two vectors coordinates mod param 'base'.
 * @param valueA The first vector to be added to the second one.
 * @param valueB The second vector to be added to the first one.
 * @param base The radix under which the calculations are performed. Default = 2.
 * @returns The sum of the two vectors.
 */
export const addVectors = (valueA: string, valueB: string, base: number = 2): string => {
    if (valueA.length !== valueB.length) throw new Error('The lengths of the strings do not match.');

    return valueA
        .split('')
        .map((charA, index) => ((+charA + +valueB[index]) % base).toString()) // + operator converts a string to a number.
        .join('');
};

/** Returns the concatenation result of two vectors.
 * @param valueA The first vector upon which the second one would be joined.
 * @param valueB The second vector to be joined to the first one.
 * @returns The concatenation of the two vectors.
 */
export const joinVectors = (valueA: string, valueB: string): string => {
    return valueA + valueB;
};

/** Calculates the weight of a vector.
 * @param value The vector to be weighted.
 * @returns The number of non-zero characters in the vector.
 */
export const calculateVectorWeight = (value: string): number => {
    return value.split('').filter(x => x !== '0').length;
};

/** Multiplies a vector by a matrix.
 * @param vector The vector to be multiplied by the matrix (length = a).
 * @param matrix The matrix to be multiplied by the vector (dimensions a x b).
 * @param base The radix under which the calculations are performed. Default = 2.
 * @throws if the vector's length does not match the matrix's height.
 * @returns The result of the multiplication (length = b).
 */
export const multiplyVectorToMatrix = (vector: string, matrix: number[][], base: number = 2): string => {
    const vectorLength = vector.length;
    if (vectorLength !== matrix.length) throw new Error("Vector's length does not match matrix's height.");

    const matrixWidth = matrix[0]?.length;
    const result = new Array(matrixWidth).fill(0); // Initialize empty result array of length b.

    const vectorArray = vector.split('').map(x => +x); // + operator converts a string to a number.
    for (let j = 0; j < matrixWidth; ++j) {
        for (let i = 0; i < vectorLength; ++i) {
            result[j] += vectorArray[i] * matrix[i][j];
        }
        result[j] %= base;
    }

    return result.join('');
};

/** Generates a vector of a given length with a given fill.
 * @param fill The character to fill the vector with.
 * @param length The length of the generated vector.
 * @param transformations An array of transformations to be applied to the vector. Default = [].
 * @returns The generated vector.
 */
export const generateVector = (
    fill: string,
    length: number,
    transformations: { index: number; character: string }[] = [],
): string => {
    const initialVector = Array(length).fill(fill);
    for (const transformation of transformations) {
        initialVector[transformation.index] = transformation.character;
    }
    return initialVector.join('');
};
