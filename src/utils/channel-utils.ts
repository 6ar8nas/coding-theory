import { validateBinary } from '.';

// Used as a default distortion probability for when a character goes through the channel.
export const defaultDistortionProbability = 0.05;

/** Simulates sending data through a distortion channel.
 * @param {string} value Channel input value in binary.
 * @param {number} distortionProbability Probability for data being transmitted through the channel to be distorted.
 * @param {number | undefined} ignoreLast Number of characters to be ignored for distortion.
 * @throws if the value is an invalid binary string expression.
 * @returns {string} Channel output, a binary string expression, consisting of the same amount of numbers as the input value.
 */
export const sendThroughChannel = (value: string, distortionProbability: number, ignoreLast: number = 0): string => {
    if (!validateBinary(value)) throw new Error('Received an unexpected non-binary string.');

    const inputLength = value.length;
    return value
        .split('')
        .map((char, index) => {
            // Check if the current character is within the exclusion range
            if (ignoreLast && index >= inputLength - ignoreLast) {
                return char;
            }

            const currentRoll = Math.random();
            if (currentRoll >= distortionProbability) return char;
            if (char === '0') return '1';
            return '0';
        })
        .join('');
};
