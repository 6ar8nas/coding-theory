import React from 'react';
import { sendThroughChannel, convertBinaryToText, convertTextToBinary } from '../../utils';
import { Channel } from '../channel/channel';
import { LabeledTextArea } from '../labeled-controls';
import { useCodecStore, useSettingsStore } from '../../state';

/** Module responsible for text contents coding workflows. */
export const TextCodingModule: React.FunctionComponent = () => {
    const { distortionProbability } = useSettingsStore();
    const { encodeBinaryString: encode, decodeBinaryString: decode } = useCodecStore();

    const [initialValue, setInitialValue] = React.useState<string>('');

    const initialBinaryValue = React.useMemo(
        () => (initialValue ? convertTextToBinary(initialValue) : ''),
        [initialValue],
    );

    const insecureValue = React.useMemo(() => {
        const receivedBinaryValue = sendThroughChannel(initialBinaryValue, distortionProbability);
        return convertBinaryToText(receivedBinaryValue);
    }, [distortionProbability, initialBinaryValue]);

    // Encoding each text only once, optimizing for distortion probability changes
    const encodedBinaryValue = React.useMemo(() => {
        return encode(initialBinaryValue);
    }, [encode, initialBinaryValue]);

    const secureValue = React.useMemo(() => {
        const receivedCodedBinaryValue = sendThroughChannel(encodedBinaryValue, distortionProbability);
        const decodedBinaryValue = decode(receivedCodedBinaryValue).substring(0, initialBinaryValue.length);
        return convertBinaryToText(decodedBinaryValue);
    }, [decode, distortionProbability, encodedBinaryValue, initialBinaryValue.length]);

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
