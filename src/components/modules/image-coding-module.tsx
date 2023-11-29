import React from 'react';
import {
    encode,
    sendThroughChannel,
    decode,
    convertBlobToImageFileData,
    convertImageFileDataToBlob,
    countPaddedCharacters,
} from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps, ImageFileData } from '../../data-types';
import { LabeledFileUpload, LabeledImage } from '../labeled-controls';

/** Module responsible for assignment's image contents coding tasks. */
export const ImageCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;

    const [imageFile, setImageFile] = React.useState<File>();
    const [imageFileError, setImageFileError] = React.useState<string>();
    const [initialImageSource, setInitialImageSource] = React.useState<string>();
    const [imageBinaryContents, setImageBinaryContents] = React.useState<ImageFileData>();

    // Trying to acquire image file data, which would include a binary content string.
    React.useEffect(() => {
        const getImageBinaryValue = async () => {
            try {
                if (!imageFile) return;
                const imageData = await convertBlobToImageFileData(imageFile);
                setImageBinaryContents(imageData);
            } catch (error) {
                if (error instanceof Error) setImageFileError(error.message);
            }
        };

        getImageBinaryValue();
        // Creating a URL for the image file to display it
        if (imageFile) setInitialImageSource(URL.createObjectURL(imageFile));
    }, [imageFile]);

    // Processing non-coded content binary string, distorting it through the channel and converting it
    // back to an image.
    const finalInsecureImage = React.useMemo(() => {
        if (!imageBinaryContents) return;

        const receivedBinaryValue = sendThroughChannel(imageBinaryContents.binaryString, distortionProbability);
        const insecureBlob = convertImageFileDataToBlob({
            ...imageBinaryContents,
            binaryString: receivedBinaryValue,
        });
        return URL.createObjectURL(insecureBlob);
    }, [distortionProbability, imageBinaryContents]);

    // Coding the content binary string and then processing it - distorting it through the channel and
    // converting it back to an image.
    const finalSecureImage = React.useMemo(() => {
        if (!imageBinaryContents) return;

        const encodedBinaryValue = encode(imageBinaryContents.binaryString);
        const paddedCharactersCount = countPaddedCharacters(imageBinaryContents.binaryString);
        const receivedCodedBinaryValue = sendThroughChannel(
            encodedBinaryValue,
            distortionProbability,
            paddedCharactersCount,
        );
        const decodedBinaryValue = decode(receivedCodedBinaryValue);
        const secureBlob = convertImageFileDataToBlob({
            ...imageBinaryContents,
            binaryString: decodedBinaryValue,
        });
        return URL.createObjectURL(secureBlob);
    }, [distortionProbability, imageBinaryContents]);

    return (
        <>
            <LabeledFileUpload
                id="initial-image"
                title="Upload an image"
                setValue={setImageFile}
                errorMessage={imageFileError}
            />
            <hr />
            <LabeledImage id="initial-image" title="Initial image" source={initialImageSource} />
            <Channel />
            <LabeledImage id="insecure-image" title="Non-coded image" source={finalInsecureImage} />
            <LabeledImage id="secure-image" title="Coded image" source={finalSecureImage} />
        </>
    );
};
