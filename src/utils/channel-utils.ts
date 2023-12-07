import { validateBinary } from '.';

/** Default distortion probability value for when a character goes through the channel. */
export const defaultDistortionProbability = 0.05;

/** Simulates sending data through a distortion channel.
 * @param value Channel input value in binary.
 * @param distortionProbability Probability for data being transmitted through the channel to be distorted.
 * @throws if the value is an invalid binary string expression.
 * @returns Channel output, a binary string expression, consisting of the same amount of numbers as the input value.
 */
export const sendThroughChannel = (value: string, distortionProbability: number): string => {
    if (!validateBinary(value)) throw new Error('Received an unexpected non-binary string.');

    return value
        .split('')
        .map(char => {
            const currentRoll = Math.random();
            if (currentRoll >= distortionProbability) return char;
            if (char === '0') return '1';
            return '0';
        })
        .join('');
};
