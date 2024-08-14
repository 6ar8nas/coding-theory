import React from 'react';
import { sendThroughChannel, convertBinaryToText, convertTextToBinary } from '../../utils';
import { LabeledTextArea } from '../labeled-controls';
import { useCodecStore, useSettingsStore } from '../../state';

/** View panel responsible for text contents coding workflows. */
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
                className="h-24"
                title="Initial data"
                placeholder="Enter a text to be encoded."
                value={initialValue}
                setValue={setInitialValue}
            />
            <LabeledTextArea
                id="non-coded-data"
                className="h-24"
                title="Non-coded text"
                value={insecureValue}
                readOnly
            />
            <LabeledTextArea id="secure-data" className="h-24" title="Coded text" value={secureValue} readOnly />
        </>
    );
};
