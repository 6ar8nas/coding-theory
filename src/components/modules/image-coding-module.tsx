import React from 'react';
import { sendThroughChannel, convertBlobToImageFileData, convertImageFileDataToBlob } from '../../utils';
import { Channel } from '../channel/channel';
import { ImageFileData } from '../../data-types';
import { LabeledFileUpload, LabeledImage } from '../labeled-controls';
import { GolayDecoder, GolayEncoder } from '../../coding';
import { useSettingsStore } from '../../state';

/** Module responsible for image contents coding workflows. */
export const ImageCodingModule: React.FunctionComponent = () => {
    const { distortionProbability } = useSettingsStore();

    const encoder = React.useMemo(() => new GolayEncoder(), []);
    const decoder = React.useMemo(() => new GolayDecoder(), []);
    const [imageFile, setImageFile] = React.useState<File>();
    const [imageFileError, setImageFileError] = React.useState<string>();
    const [imageBinaryContents, setImageBinaryContents] = React.useState<ImageFileData>();

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

    const initialImageSource = React.useMemo(() => {
        if (imageFile) return URL.createObjectURL(imageFile);
    }, [imageFile]);

    const finalInsecureImage = React.useMemo(() => {
        if (!imageBinaryContents) return;

        const receivedBinaryValue = sendThroughChannel(imageBinaryContents.binaryString, distortionProbability);
        const insecureBlob = convertImageFileDataToBlob({
            ...imageBinaryContents,
            binaryString: receivedBinaryValue,
        });
        return URL.createObjectURL(insecureBlob);
    }, [distortionProbability, imageBinaryContents]);

    const finalSecureImage = React.useMemo(() => {
        if (!imageBinaryContents) return;

        const encodedBinaryValue = encoder.encode(imageBinaryContents.binaryString);
        const receivedCodedBinaryValue = sendThroughChannel(encodedBinaryValue, distortionProbability);
        const decodedBinaryValue = decoder
            .decode(receivedCodedBinaryValue)
            .substring(0, imageBinaryContents.binaryString.length);
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
