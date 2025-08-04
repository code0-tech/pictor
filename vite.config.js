import { defineConfig } from 'vite'
import { resolve, relative, extname } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import react from '@vitejs/plugin-react'
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig({
    plugins: [
        react(),
        libInjectCss(),
        dts({
            include: ['src'],
            exclude: ['src/**/*.stories.tsx'],
            afterDiagnostic: (diagnostics) => {
                if (diagnostics.length > 0) {
                    throw new Error("dts failed");
                }
            },
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es']
        },
        rollupOptions: {
            external: [...Object.keys(pkg.peerDependencies), 'react/jsx-runtime'],
            input: Object.fromEntries(
                glob.sync('src/**/*.{ts,tsx}', {ignore: ['src/**/*.stories.tsx', 'src/**/*.test.ts']}).map(file => [
                    relative('src', file.slice(0, file.length - extname(file).length)),
                    fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
            output: {
                assetFileNames: 'assets/[name].[ext]',
                entryFileNames: '[name].js',
            }
        }
    },
})
