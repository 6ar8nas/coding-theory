import React from 'react';
import { sendThroughChannel, validateBinary, compareBinaryStringsExclusiveOr } from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps } from '../../data-types';
import { LabeledInput } from '../labeled-controls';
import { GolayDecoder, GolayEncoder } from '../../coding';

/** Module responsible for assignment's binary string coding workflows. */
export const BinaryCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;
    const nonBinaryErrorMessage = 'Input contained non-binary characters';

    const encoder = React.useMemo(() => new GolayEncoder(), []);
    const decoder = React.useMemo(() => new GolayDecoder(), []);
    const [initialValue, _setInitialValue] = React.useState<string>('');
    const [initialValueError, setInitialValueError] = React.useState<string>();
    const [receivedValue, _setReceivedValue] = React.useState<string>('');
    const [receivedValueError, setReceivedValueError] = React.useState<string>();
    const [errorVectorError, setErrorVectorError] = React.useState<string>();

    // A validating setter function for user initial value input.
    const setInitialValue = (value: string): void => {
        _setInitialValue(value);
        if (value && !validateBinary(value)) {
            setInitialValueError(nonBinaryErrorMessage);
        } else if (value && value.length % GolayEncoder.codeLength !== 0) {
            setInitialValueError(`The input should consist of a multiple of ${GolayEncoder.codeLength} characters.`);
        } else setInitialValueError(undefined);
    };

    // A validating setter function for user received value input.
    const setReceivedValue = (value: string): void => {
        _setReceivedValue(value);
        if (value && !validateBinary(value)) {
            setReceivedValueError(nonBinaryErrorMessage);
        } else if (value && value.length % GolayDecoder.codeLength !== 0) {
            setReceivedValueError(`The input should consist of a multiple of ${GolayDecoder.codeLength} characters.`);
        } else setReceivedValueError(undefined);
    };

    // Encoding the initial value.
    const encodedValue = React.useMemo(() => {
        if (initialValueError) return '';
        return encoder.encode(initialValue);
    }, [encoder, initialValue, initialValueError]);

    // Setting the channel output as the received value.
    React.useEffect(() => {
        setReceivedValue(sendThroughChannel(encodedValue, distortionProbability));
    }, [distortionProbability, encodedValue]);

    // Calculating the error vector between encoded and received values using binary XOR.
    const errorVector = React.useMemo(() => {
        try {
            const xorResult = compareBinaryStringsExclusiveOr(encodedValue, receivedValue);
            setErrorVectorError(undefined);
            return xorResult;
        } catch (error) {
            if (error instanceof Error) setErrorVectorError(error.message);
            return '';
        }
        // encodedValue omitted as on each change, the receivedValue would always change with a small delay right after.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedValue]);

    // Decoding the received value.
    const decodedValue = React.useMemo(() => {
        if (receivedValueError) return '';
        return decoder.decode(receivedValue);
    }, [decoder, receivedValue, receivedValueError]);

    return (
        <>
            <LabeledInput
                id="initial-value"
                inputMode="numeric"
                title="Initial data"
                placeholder="Enter a binary number."
                value={initialValue}
                setValue={setInitialValue}
                errorMessage={initialValueError}
            />
            <LabeledInput id="encoded-value" inputMode="numeric" title="Encoded data" value={encodedValue} readOnly />
            <Channel />
            <LabeledInput
                id="error-vector"
                inputMode="numeric"
                title="Error vector"
                value={errorVector}
                errorMessage={errorVectorError}
                readOnly
            />
            <LabeledInput
                id="received-value"
                inputMode="numeric"
                title="Received data"
                placeholder="Data in this field can be manipulated."
                value={receivedValue}
                setValue={setReceivedValue}
                errorMessage={receivedValueError}
            />
            <LabeledInput id="decoded-value" inputMode="numeric" title="Decoded data" value={decodedValue} readOnly />
        </>
    );
};
