import { parseIntStrict } from './string-utils';

/** Calculates the sum of two vectors coordinates mod param 'base'.
 * @param valueA First vector for addition.
 * @param valueB Second vector for addition.
 * @param base The radix under which the calculations are performed. Default = 2.
 * @throws if the length of the vectors to not match.
 * @throws if the vectors contain invalid characters for the given base.
 * @returns The sum of the two vectors.
 */
export const addVectors = (valueA: string, valueB: string, base: number = 2): string => {
    if (valueA.length !== valueB.length) throw new Error('The lengths of the strings do not match.');

    return valueA
        .split('')
        .map((charA, index) => {
            const coordA = parseIntStrict(charA, base);
            const coordB = parseIntStrict(valueB[index], base);

            return ((coordA + coordB) % base).toString(base);
        })
        .join('');
};

/** Returns the concatenation result of two vectors.
 * @param valueA First vector to be joined.
 * @param valueB Second vector to be joined.
 * @returns Two input vectors consolidated into one.
 */
export const joinVectors = (valueA: string, valueB: string): string => {
    return valueA.concat(valueB);
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
 * @throws if the vectors contain invalid characters for the given base.
 * @returns The result of the multiplication (length = b).
 */
export const multiplyVectorToMatrix = (vector: string, matrix: number[][], base: number = 2): string => {
    const { length: vectorLength } = vector;
    if (vectorLength !== matrix.length) throw new Error("Vector's length does not match matrix's height.");

    const matrixWidth = matrix[0]?.length;
    const result = new Array(matrixWidth).fill(0);

    const vectorArray = vector.split('').map(x => parseIntStrict(x, base));
    for (let j = 0; j < matrixWidth; ++j) {
        for (let i = 0; i < vectorLength; ++i) {
            result[j] += vectorArray[i] * matrix[i][j];
        }
        result[j] %= base;
    }

    return result.join('');
};

/** Generates a vector of a given length with a given fill
 * @param fill Value to fill the vector with.
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
    return initialVector.join('').substring(0, length);
};
