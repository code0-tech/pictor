/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve, relative, extname } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import react from '@vitejs/plugin-react';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts';
import pkg from './package.json';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: ['babel-plugin-react-compiler', ['@babel/plugin-proposal-decorators', {
        decoratorsBeforeExport: true
      }], '@babel/plugin-transform-class-properties']
    }
  }), libInjectCss(), dts({
    include: ['src'],
    exclude: ['src/**/*.stories.tsx'],
    afterDiagnostic: diagnostics => {
      if (diagnostics.length > 0) {
        throw new Error("dts failed");
      }
    }
  })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies), 'react/jsx-runtime'],
      input: Object.fromEntries(glob.sync('src/**/*.{ts,tsx}', {
        ignore: ['src/**/*.stories.tsx', 'src/**/*.test.ts']
      }).map(file => [relative('src', file.slice(0, file.length - extname(file).length)), fileURLToPath(new URL(file, import.meta.url))])),
      output: {
        assetFileNames: 'assets/[name].[ext]',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js'
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});