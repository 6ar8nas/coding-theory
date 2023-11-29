import { validateBinary } from '.';
import { ImageFileData } from '../data-types';

/** Converts an image file to a binary string and saves the initial Blob header data.
 * @param {Blob} image An image file to be converted to a binary string
 * @throws if the image type is unsupported.
 */
export const convertBlobToImageFileData = async (image: Blob): Promise<ImageFileData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            if (event.target?.result) {
                // Store data as decimal values array.
                const dataArray = new Uint8Array(event.target.result as ArrayBuffer);

                switch (image.type) {
                    case 'image/bmp': {
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
                        reject(new Error('Only BMP images are currently supported.'));
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
 * @param {string} binaryString A binary string to be converted to blob.
 * @param {string} mimeType MIME type of the blob.
 * @param {Uint8Array} header Header information for the blob.
 * @throws if the binaryString is a non-binary value.
 * @throws if the mimeType is unsupported.
 */
export const convertImageFileDataToBlob = (imageData: ImageFileData): Blob => {
    if (!validateBinary(imageData.binaryString)) throw new Error('Received an unexpected non-binary string.');

    // Split binary string into 8-bit substrings using RegEx.
    const binaryArray = imageData.binaryString.match(/.{1,8}/g) || [];

    // Parsing each binary number to a decimal.
    const decimalValues = binaryArray.map(binarySubString => parseInt(binarySubString, 2));

    let bytesArray: Uint8Array;
    switch (imageData.mimeType) {
        case 'image/bmp': {
            bytesArray = new Uint8Array([...imageData.header, ...decimalValues]);
            break;
        }
        default: {
            throw new Error('Only BMP images are currently supported.');
        }
    }
    return new Blob([bytesArray], { type: imageData.mimeType });
};
