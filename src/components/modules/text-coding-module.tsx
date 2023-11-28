import React from 'react';
import { LabeledTextArea } from '../labeled-controls/labeled-text-area';
import {
    encode,
    sendThroughChannel,
    decode,
    convertBinaryToText,
    convertTextToBinary,
    countPaddedCharacters,
} from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps } from '../../data-types/coding-module-props';

// TODO: error handling, comments
export const TextCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;

    const [initialValue, setInitialValue] = React.useState<string>('');
    const initialBinaryValue = React.useMemo(() => convertTextToBinary(initialValue), [initialValue]);

    const insecureValue = React.useMemo(() => {
        const receivedBinaryValue = sendThroughChannel(initialBinaryValue, distortionProbability);
        return convertBinaryToText(receivedBinaryValue);
    }, [distortionProbability, initialBinaryValue]);

    const secureValue = React.useMemo(() => {
        const encodedBinaryValue = encode(initialBinaryValue);
        const paddedCharactersCount = countPaddedCharacters(initialBinaryValue);
        const receivedCodedBinaryValue = sendThroughChannel(
            encodedBinaryValue,
            distortionProbability,
            paddedCharactersCount,
        );
        const decodedBinaryValue = decode(receivedCodedBinaryValue);
        return convertBinaryToText(decodedBinaryValue);
    }, [distortionProbability, initialBinaryValue]);

    return (
        <>
            <LabeledTextArea
                id="initial-value"
                title="Initial data"
                placeholder="Enter a desired text."
                value={initialValue}
                setValue={setInitialValue}
            />
            <Channel />
            <LabeledTextArea id="non-coded-data" title="Non-coded text" value={insecureValue} readOnly />
            <LabeledTextArea id="secure-data" title="Coded text" value={secureValue} readOnly />
        </>
    );
};
