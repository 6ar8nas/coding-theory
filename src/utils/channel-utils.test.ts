import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendThroughChannel } from './channel-utils';

describe(sendThroughChannel.name, () => {
    const originalRandom = Math.random;

    afterEach(() => {
        Math.random = originalRandom;
    });

    it.each([
        { probability: 1, expected: '101101' },
        { probability: 0.8, expected: '111100' },
        { probability: 0.5, expected: '110100' },
        { probability: 0.3, expected: '110110' },
        { probability: 0.2, expected: '110010' },
        { probability: 0, expected: '010010' },
    ])('distorts input randomly with distortion probability $probability', ({ probability, expected }) => {
        const input = '010010';
        const randomValues = [0.1, 0.8, 0.5, 0.2, 0.3, 0.9];

        // Mock Math.random to simulate distortion
        let index = 0;
        const randomMock = vi.fn(() => randomValues[index++]);
        Math.random = randomMock;

        const result = sendThroughChannel(input, probability);

        expect(result).to.equal(expected);
    });

    it('throws if the input is not a binary string', () => {
        expect(() => sendThroughChannel('abc', 0.1)).to.throw(Error, 'Received an unexpected non-binary string.');
    });
});
