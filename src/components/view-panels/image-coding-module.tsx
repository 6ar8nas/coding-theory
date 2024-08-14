import React from 'react';
import { sendThroughChannel, convertBlobToImageFileData, convertImageFileDataToBlob } from '../../utils';
import { ImageFileData } from '../../types';
import { LabeledFileUpload, LabeledImage } from '../labeled-controls';
import { useSettingsStore, useCodecStore } from '../../state';

/** View panel responsible for image contents coding workflows. */
export const ImageCodingModule: React.FunctionComponent = () => {
    const { distortionProbability } = useSettingsStore();
    const { encodeBinaryString: encode, decodeBinaryString: decode } = useCodecStore();

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

    const finalInsecureImage = React.useMemo(() => {
        if (!imageBinaryContents) return;

        const receivedBinaryValue = sendThroughChannel(imageBinaryContents.binaryString, distortionProbability);
        const insecureBlob = convertImageFileDataToBlob({
            ...imageBinaryContents,
            binaryString: receivedBinaryValue,
        });
        return URL.createObjectURL(insecureBlob);
    }, [distortionProbability, imageBinaryContents]);

    // Encoding each image contents only once, optimizing for distortion probability changes
    const encodedBinaryValue = React.useMemo(() => {
        if (!imageBinaryContents) return;
        return encode(imageBinaryContents.binaryString);
    }, [encode, imageBinaryContents]);

    const finalSecureImage = React.useMemo(() => {
        if (!encodedBinaryValue || !imageBinaryContents) return;

        const receivedCodedBinaryValue = sendThroughChannel(encodedBinaryValue, distortionProbability);
        const decodedBinaryValue = decode(receivedCodedBinaryValue).substring(
            0,
            imageBinaryContents.binaryString.length,
        );
        const secureBlob = convertImageFileDataToBlob({
            ...imageBinaryContents,
            binaryString: decodedBinaryValue,
        });
        return URL.createObjectURL(secureBlob);
    }, [decode, distortionProbability, imageBinaryContents, encodedBinaryValue]);

    // Cleaning up after URL object on unmount or file change.
    React.useEffect(
        () => () => {
            if (finalInsecureImage) URL.revokeObjectURL(finalInsecureImage);
            if (finalSecureImage) URL.revokeObjectURL(finalSecureImage);
        },
        [finalInsecureImage, finalSecureImage],
    );

    return (
        <>
            <LabeledFileUpload
                id="initial-image"
                className="file-input-bordered w-full"
                title="Upload an image"
                setValue={setImageFile}
                errorMessage={imageFileError}
            />
            <div className="divider" />
            {finalInsecureImage && finalSecureImage && (
                <div className="flex w-full flex-col md:flex-row">
                    <LabeledImage id="insecure-image" title="Non-coded image" src={finalInsecureImage} />
                    <div className="divider md:divider-horizontal" />
                    <LabeledImage id="secure-image" title="Coded image" src={finalSecureImage} />
                </div>
            )}
        </>
    );
};
