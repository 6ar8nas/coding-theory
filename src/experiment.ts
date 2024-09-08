import { GolayDecoder, GolayEncoder } from './codec';
import { compareBinaryStringsExclusiveOr, sendThroughChannel } from './utils';

const encoder = new GolayEncoder();
const decoder = new GolayDecoder();

const distortionProbabilities = Array.from({ length: 101 }, (_, i) => i * 0.0025); // [0, 0.0025, ..., 0.2475, 0.25]
const inputLength = 10008; // the number needs to be divisible by 12
const attemptCount = 100;

for (const distProb of distortionProbabilities) {
    let timerCoded = 0;
    let errorCountCoded = 0;
    let timerNonCoded = 0;
    let errorCountNonCoded = 0;
    for (let attempt = 0; attempt < attemptCount; ++attempt) {
        const input = Array.from({ length: inputLength }, () => (Math.random() < 0.5 ? '0' : '1')).join('');

        const codedStart = new Date();
        const encodedString = encoder.encode(input);
        const channelOutput = sendThroughChannel(encodedString, distProb);
        const decodedString = decoder.decode(channelOutput);
        const codedFinish = new Date();

        timerCoded += codedFinish.getTime() - codedStart.getTime();
        errorCountCoded += compareBinaryStringsExclusiveOr(input, decodedString)
            .split('')
            .filter(item => item === '1').length;

        const nonCodedStart = new Date();
        const nonCodedOutput = sendThroughChannel(input, distProb);
        const nonCodedFinish = new Date();

        timerNonCoded += nonCodedFinish.getTime() - nonCodedStart.getTime();
        errorCountNonCoded += compareBinaryStringsExclusiveOr(input, nonCodedOutput)
            .split('')
            .filter(item => item === '1').length;
    }

    console.log('-----------------------------------');
    console.log(`Distortion probability: ${distProb.toFixed(4)}`);
    console.log(`Coded input workflow error count ${(errorCountCoded / attemptCount).toFixed(2)}`);
    console.log(`Non-coded input workflow error count ${(errorCountNonCoded / attemptCount).toFixed(2)}`);
    console.log(`Coded input workflow duration ${(timerCoded / attemptCount).toFixed(2)} ms`);
    console.log(`Non-coded input workflow duration ${(timerNonCoded / attemptCount).toFixed(2)} ms`);
}
