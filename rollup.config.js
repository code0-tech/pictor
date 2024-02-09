import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import postcss from "rollup-plugin-postcss";
import visualizer from 'rollup-plugin-visualizer';
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");
const extensions = ['.js', '.ts', '.jsx', '.tsx'];
const excludeExtensions = [
    'test.js',
    'test.ts',
    'test.jsx',
    'test.tsx',
    'stories.js',
    'stories.ts',
    'stories.jsx',
    'stories.tsx',
];

export default [{
    input: "src/index.ts",
    output: [
        {
            file: packageJson.main,
            format: "cjs",
            sourcemap: false,
        },
        {
            file: packageJson.module,
            format: "esm",
            sourcemap: false,
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: "./tsconfig.json",
            declaration: true,
            declarationDir: 'dist',
            exclude: ["**/__stories__", "**/*.stories.tsx"]
        }),
        postcss(),
        visualizer({
            filename: 'bundle-analysis.html',
            open: false,
        }),
    ],
    external: ["react", "react-dom"],
}, {
    input: "dist/esm/index.d.ts",
    output: [{file: "dist/index.d.ts", format: "esm"}],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
}]