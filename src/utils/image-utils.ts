import { validateBinary } from '.';
import { ImageFileData } from '../data-types';

/** Image formats that are currently supported by the image conversion utilities. */
export enum SupportedImageFileFormat {
    BMP = 'image/bmp',
}

/** Converts an image file to a binary string and saves the initial blob header data.
 * @param image An image file to be converted to a binary string
 * @throws if the image type is unsupported.
 * @returns An object containing the binary string and the header data.
 */
export const convertBlobToImageFileData = async (image: Blob): Promise<ImageFileData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            if (event.target?.result) {
                // Store data as decimal values array.
                const dataArray = new Uint8Array(event.target.result as ArrayBuffer);

                switch (image.type) {
                    case SupportedImageFileFormat.BMP: {
                        // Check if it's a valid BMP file
                        if (dataArray[0] !== 0x42 || dataArray[1] !== 0x4d) {
                            reject(new Error('BMP header not found.'));
                            return;
                        }

                        // Extract the header and content based on the BMP file format specifications
                        const headerSize =
                            dataArray[14] + (dataArray[15] << 8) + (dataArray[16] << 16) + (dataArray[17] << 24);
                        const header = dataArray.subarray(0, headerSize);
                        const content = dataArray.subarray(headerSize);

                        // Convert the content part to a binary string.
                        const binaryString = Array.from(content)
                            .map(byte => byte.toString(2).padStart(8, '0'))
                            .join('');
                        resolve({ binaryString, header, mimeType: image.type });
                        break;
                    }
                    default: {
                        reject(
                            new Error(`Only ${Object.keys(SupportedImageFileFormat).join(', ')} images 
                                are currently supported.`),
                        );
                        return;
                    }
                }
            } else reject(new Error('Failed reading the file.'));
        };
        reader.onerror = () => {
            reject(new Error('Error loading the file.'));
        };

        reader.readAsArrayBuffer(image);
    });
};

/** Converts a binary string to a blob file.
 * @param imageData An object containing the binary string and the header data.
 * @throws if the binaryString is a non-binary value.
 * @throws if the mimeType is unsupported.
 * @returns An image blob file.
 */
export const convertImageFileDataToBlob = (imageData: ImageFileData): Blob => {
    if (!validateBinary(imageData.binaryString)) throw new Error('Received an unexpected non-binary string.');

    // Split binary string into 8-bit substrings.
    const binaryArray = imageData.binaryString.match(/.{1,8}/g) || [];
    const decimalValues = binaryArray.map(binarySubString => parseInt(binarySubString, 2));

    let bytesArray: Uint8Array;
    switch (imageData.mimeType) {
        case SupportedImageFileFormat.BMP: {
            bytesArray = new Uint8Array([...imageData.header, ...decimalValues]);
            break;
        }
        default: {
            throw new Error(`Only ${Object.keys(SupportedImageFileFormat).join(', ')} images are currently supported.`);
        }
    }
    return new Blob([bytesArray], { type: imageData.mimeType });
};
