import { create } from 'zustand';

/** Default distortion probability value for when a character goes through the channel. */
export const defaultDistortionProbability = 0.05;

interface SettingsState {
    distortionProbability: number;
    setDistortionProbability: (payload: number) => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
    distortionProbability: defaultDistortionProbability,
    setDistortionProbability: (payload: number) => set(state => ({ ...state, distortionProbability: payload })),
}));
