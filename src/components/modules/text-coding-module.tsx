import React from 'react';
import { sendThroughChannel, convertBinaryToText, convertTextToBinary } from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps } from '../../data-types';
import { LabeledTextArea } from '../labeled-controls';
import { GolayDecoder, GolayEncoder } from '../../coding';

/** Module responsible for assignment's text contents coding workflows. */
export const TextCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;

    const encoder = React.useMemo(() => new GolayEncoder(), []);
    const decoder = React.useMemo(() => new GolayDecoder(), []);
    const [initialValue, setInitialValue] = React.useState<string>('');

    // Converting the initial value to binary
    const initialBinaryValue = React.useMemo(
        () => (initialValue ? convertTextToBinary(initialValue) : ''),
        [initialValue],
    );

    // Processing non-coded content binary string, distorting it through the channel and converting it
    // back to a text string.
    const insecureValue = React.useMemo(() => {
        const receivedBinaryValue = sendThroughChannel(initialBinaryValue, distortionProbability);
        return convertBinaryToText(receivedBinaryValue);
    }, [distortionProbability, initialBinaryValue]);

    // Coding the content binary string and then processing it - distorting it through the channel and
    // converting it back to a text string.
    const secureValue = React.useMemo(() => {
        const encodedBinaryValue = encoder.encode(initialBinaryValue);
        const receivedCodedBinaryValue = sendThroughChannel(encodedBinaryValue, distortionProbability);
        const decodedBinaryValue = decoder.decode(receivedCodedBinaryValue).substring(0, initialBinaryValue.length);
        return convertBinaryToText(decodedBinaryValue);
    }, [decoder, distortionProbability, encoder, initialBinaryValue]);

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
