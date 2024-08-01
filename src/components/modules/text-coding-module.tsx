import React from 'react';
import { sendThroughChannel, convertBinaryToText, convertTextToBinary } from '../../utils';
import { Channel } from '../channel/channel';
import { LabeledTextArea } from '../labeled-controls';
import { GolayDecoder, GolayEncoder } from '../../coding';
import { useSettingsStore } from '../../state';

/** Module responsible for text contents coding workflows. */
export const TextCodingModule: React.FunctionComponent = () => {
    const { distortionProbability } = useSettingsStore();

    const encoder = React.useMemo(() => new GolayEncoder(), []);
    const decoder = React.useMemo(() => new GolayDecoder(), []);
    const [initialValue, setInitialValue] = React.useState<string>('');

    const initialBinaryValue = React.useMemo(
        () => (initialValue ? convertTextToBinary(initialValue) : ''),
        [initialValue],
    );

    const insecureValue = React.useMemo(() => {
        const receivedBinaryValue = sendThroughChannel(initialBinaryValue, distortionProbability);
        return convertBinaryToText(receivedBinaryValue);
    }, [distortionProbability, initialBinaryValue]);

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
                placeholder="Enter a text to be encoded."
                value={initialValue}
                setValue={setInitialValue}
            />
            <Channel />
            <LabeledTextArea id="non-coded-data" title="Non-coded text" value={insecureValue} readOnly />
            <LabeledTextArea id="secure-data" title="Coded text" value={secureValue} readOnly />
        </>
    );
};
