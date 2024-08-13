import { create } from 'zustand';
import { GolayDecoder, GolayEncoder } from '../coding';

const encoder = new GolayEncoder();
const decoder = new GolayDecoder();

interface CodecState {
    encodeBinaryString: (payload: string) => string;
    decodeBinaryString: (payload: string) => string;
}

export const useCodecStore = create<CodecState>(() => ({
    encodeBinaryString: encoder.encode,
    decodeBinaryString: decoder.decode,
}));
