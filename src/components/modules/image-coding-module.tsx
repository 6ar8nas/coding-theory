import React from 'react';
import { sendThroughChannel, convertBlobToImageFileData, convertImageFileDataToBlob } from '../../utils';
import { Channel } from '../channel/channel';
import { CodingModuleProps, ImageFileData } from '../../data-types';
import { LabeledFileUpload, LabeledImage } from '../labeled-controls';
import { GolayDecoder, GolayEncoder } from '../../coding';

/** Module responsible for assignment's image contents coding workflows. */
export const ImageCodingModule: React.FC<CodingModuleProps> = props => {
    const { distortionProbability } = props;

    const encoder = React.useMemo(() => new GolayEncoder(), []);
    const decoder = React.useMemo(() => new GolayDecoder(), []);
    const [imageFile, setImageFile] = React.useState<File>();
    const [imageFileError, setImageFileError] = React.useState<string>();
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
    }, [imageFile]);

    // Creating a URL for the image file to display it
    const initialImageSource = React.useMemo(() => {
        if (imageFile) return URL.createObjectURL(imageFile);
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

        const encodedBinaryValue = encoder.encode(imageBinaryContents.binaryString);
        const paddedCharactersCount = encoder.countPaddedCharacters(imageBinaryContents.binaryString);
        const receivedCodedBinaryValue = sendThroughChannel(
            encodedBinaryValue,
            distortionProbability,
            paddedCharactersCount,
        );
        const decodedBinaryValue = decoder.decode(receivedCodedBinaryValue);
        const secureBlob = convertImageFileDataToBlob({
            ...imageBinaryContents,
            binaryString: decodedBinaryValue,
        });
        return URL.createObjectURL(secureBlob);
    }, [decoder, distortionProbability, encoder, imageBinaryContents]);

    // Cleaning up after URL object on unmount or file change.
    React.useEffect(
        () => () => {
            if (initialImageSource) URL.revokeObjectURL(initialImageSource);
            if (finalInsecureImage) URL.revokeObjectURL(finalInsecureImage);
            if (finalSecureImage) URL.revokeObjectURL(finalSecureImage);
        },
        [initialImageSource, finalInsecureImage, finalSecureImage],
    );

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
