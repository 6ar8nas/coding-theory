import React from 'react';
import { LabeledInput } from '../labeled-controls/labeled-input';
import {
    encode,
    sendThroughChannel,
    decode,
    validateBinary,
    encodingCodeLength,
    compareBinaryStringsExclusiveOr,
    decodingCodeLength,
} from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps } from '../../data-types/coding-module-props';

// TODO: comments
export const BinaryCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;
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
        } else if (value && value.length % encodingCodeLength !== 0) {
            setInitialValueError(`The input should consist of a multiple of ${encodingCodeLength} characters.`);
        } else setInitialValueError(undefined);
    };

    const setReceivedValue = (value: string): void => {
        _setReceivedValue(value);
        if (value && !validateBinary(value)) {
            setReceivedValueError(nonBinaryErrorMessage);
        } else if (value && value.length % decodingCodeLength !== 0) {
            setReceivedValueError(`The input should consist of a multiple of ${decodingCodeLength} characters.`);
        } else setReceivedValueError(undefined);
    };

    const encodedValue = React.useMemo(() => {
        if (!initialValue || initialValueError) return '';
        return encode(initialValue);
    }, [initialValue, initialValueError]);

    React.useEffect(() => {
        if (!encodedValue) return setReceivedValue('');
        setReceivedValue(sendThroughChannel(encodedValue, distortionProbability));
    }, [distortionProbability, encodedValue]);

    const errorVector = React.useMemo(() => {
        if (encodedValue.length !== receivedValue.length) {
            setErrorVectorError('The length of the strings does not match.');
            return '';
        }
        if (!encodedValue || !receivedValue) return '';

        setErrorVectorError(undefined);
        return compareBinaryStringsExclusiveOr(encodedValue, receivedValue);
        // encodedValue omitted as on each change, the receivedValue would always change with a small delay right after.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedValue, receivedValueError]);

    const decodedValue = React.useMemo(() => {
        if (!receivedValue || receivedValueError) return '';
        return decode(receivedValue);
    }, [receivedValue, receivedValueError]);

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
