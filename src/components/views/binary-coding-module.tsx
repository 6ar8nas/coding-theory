import React from 'react';
import { sendThroughChannel, validateBinary, compareBinaryStringsExclusiveOr } from '../../utils';
import { LabeledInput } from '../labeled-controls';
import { GolayDecoder, GolayEncoder } from '../../codec';
import { useSettingsStore, useCodecStore } from '../../state';

/** View panel responsible for binary string coding workflows. */
export const BinaryCodingModule: React.FunctionComponent = () => {
    const { distortionProbability } = useSettingsStore();
    const { encodeBinaryString: encode, decodeBinaryString: decode } = useCodecStore();

    const nonBinaryErrorMessage = 'Input contained non-binary characters';

    const [initialValue, _setInitialValue] = React.useState<string>('');
    const [initialValueError, setInitialValueError] = React.useState<string>();
    const [receivedValue, _setReceivedValue] = React.useState<string>('');
    const [receivedValueError, setReceivedValueError] = React.useState<string>();
    const [errorVectorError, setErrorVectorError] = React.useState<string>();

    const setInitialValue = (value: string): void => {
        _setInitialValue(value);
        if (value && !validateBinary(value)) {
            setInitialValueError(nonBinaryErrorMessage);
        } else if (value && value.length % GolayEncoder.codeLength !== 0) {
            setInitialValueError(`The input should consist of a multiple of ${GolayEncoder.codeLength} characters.`);
        } else setInitialValueError(undefined);
    };

    const setReceivedValue = (value: string): void => {
        _setReceivedValue(value);
        if (value && !validateBinary(value)) {
            setReceivedValueError(nonBinaryErrorMessage);
        } else if (value && value.length % GolayDecoder.codeLength !== 0) {
            setReceivedValueError(`The input should consist of a multiple of ${GolayDecoder.codeLength} characters.`);
        } else setReceivedValueError(undefined);
    };

    const encodedValue = React.useMemo(() => {
        if (initialValueError) return '';
        return encode(initialValue);
    }, [encode, initialValue, initialValueError]);

    React.useEffect(() => {
        setReceivedValue(sendThroughChannel(encodedValue, distortionProbability));
    }, [distortionProbability, encodedValue]);

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

    const decodedValue = React.useMemo(() => {
        if (receivedValueError) return '';
        return decode(receivedValue);
    }, [decode, receivedValue, receivedValueError]);

    return (
        <>
            <LabeledInput
                id="initial-value"
                className="w-full input-md"
                inputMode="numeric"
                title="Initial data"
                placeholder="Enter a binary number to be encoded."
                value={initialValue}
                setValue={setInitialValue}
                errorMessage={initialValueError}
            />
            <LabeledInput
                id="encoded-value"
                className="w-full input-md"
                inputMode="numeric"
                title="Encoded data"
                value={encodedValue}
                readOnly
            />
            <LabeledInput
                id="error-vector"
                className="w-full input-md"
                inputMode="numeric"
                title="Error vector"
                value={errorVector}
                errorMessage={errorVectorError}
                readOnly
            />
            <LabeledInput
                id="received-value"
                className="w-full input-md"
                inputMode="numeric"
                title="Received data"
                placeholder="Data in this field can be manipulated to better test the decoding algorithm."
                value={receivedValue}
                setValue={setReceivedValue}
                errorMessage={receivedValueError}
            />
            <LabeledInput
                id="decoded-value"
                className="w-full input-md"
                inputMode="numeric"
                title="Decoded data"
                value={decodedValue}
                readOnly
            />
        </>
    );
};
