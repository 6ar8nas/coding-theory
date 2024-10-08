/// <reference types="vitest" />
import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: { root: path.resolve(__dirname, './src') },
    base: './',
});
