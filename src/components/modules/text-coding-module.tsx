import React from 'react';
import {
    encode,
    sendThroughChannel,
    decode,
    convertBinaryToText,
    convertTextToBinary,
    countPaddedCharacters,
} from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps } from '../../data-types';
import { LabeledTextArea } from '../labeled-controls';

/** Module responsible for assignment's text string coding tasks. */
export const TextCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;

    const [initialValue, setInitialValue] = React.useState<string>('');

    // Converting the initial value to binary
    const initialBinaryValue = React.useMemo(() => convertTextToBinary(initialValue), [initialValue]);

    // Processing non-coded content binary string, distorting it through the channel and converting it
    // back to a text string.
    const insecureValue = React.useMemo(() => {
        const receivedBinaryValue = sendThroughChannel(initialBinaryValue, distortionProbability);
        return convertBinaryToText(receivedBinaryValue);
    }, [distortionProbability, initialBinaryValue]);

    // Coding the content binary string and then processing it - distorting it through the channel and
    // converting it back to a text string.
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
