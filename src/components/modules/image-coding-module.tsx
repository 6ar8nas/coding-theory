import React from 'react';
import {
    encode,
    sendThroughChannel,
    decode,
    convertBlobToBinary,
    convertBinaryToBlob,
    countPaddedCharacters,
} from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps } from '../../data-types/coding-module-props';
import { LabeledFileUpload } from '../labeled-controls/labeled-file-upload';
import { LabeledImage } from '../labeled-controls/labeled-image';

// TODO: error handling, comments
export const ImageCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;

    const [imageFile, setImageFile] = React.useState<File>();
    const [initialImageSource, setInitialImageSource] = React.useState<string>();
    const [imageBinaryContents, setImageBinaryContents] = React.useState<{
        header: Uint8Array;
        binaryString: string;
    }>();

    React.useEffect(() => {
        const getImageBinaryValue = async () => {
            if (imageFile) setImageBinaryContents(await convertBlobToBinary(imageFile));
        };
        getImageBinaryValue();
        if (imageFile) setInitialImageSource(URL.createObjectURL(imageFile));
    }, [imageFile]);

    const finalInsecureImage = React.useMemo(() => {
        if (!imageBinaryContents || !imageFile) return;

        const receivedBinaryValue = sendThroughChannel(imageBinaryContents.binaryString, distortionProbability);
        const insecureBlob = convertBinaryToBlob(receivedBinaryValue, imageFile.type, imageBinaryContents.header);
        return URL.createObjectURL(insecureBlob);
    }, [distortionProbability, imageBinaryContents, imageFile]);

    const finalSecureImage = React.useMemo(() => {
        if (!imageBinaryContents || !imageFile) return;

        const encodedBinaryValue = encode(imageBinaryContents.binaryString);
        const paddedCharactersCount = countPaddedCharacters(imageBinaryContents.binaryString);
        const receivedCodedBinaryValue = sendThroughChannel(
            encodedBinaryValue,
            distortionProbability,
            paddedCharactersCount,
        );
        const decodedBinaryValue = decode(receivedCodedBinaryValue);
        const secureBlob = convertBinaryToBlob(decodedBinaryValue, imageFile.type, imageBinaryContents.header);
        return URL.createObjectURL(secureBlob);
    }, [distortionProbability, imageBinaryContents, imageFile]);

    return (
        <>
            <LabeledFileUpload id="initial-image" title="Upload an image" setValue={setImageFile} />
            <hr />
            <LabeledImage id="initial-image" title="Initial image" source={initialImageSource} />
            <Channel />
            <LabeledImage id="insecure-image" title="Non-coded image" source={finalInsecureImage} />
            <LabeledImage id="secure-image" title="Coded image" source={finalSecureImage} />
        </>
    );
};
