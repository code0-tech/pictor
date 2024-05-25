import resolve from "@rollup/plugin-node-resolve";
import external from 'rollup-plugin-peer-deps-external';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser"
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default [{
    input: "./src/index.ts",
    output: {
        dir: "dist/esm",
        format: "esm",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: (chunkInfo) => {
            if (chunkInfo.name.includes('node_modules')) {
                return chunkInfo.name.replace('node_modules', 'external') + '.js';
            }

            return '[name].js';
        }
    },
    plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: "./tsconfig.json",
            declaration: true,
            declarationDir: 'dist/esm',
            exclude: ["**/__stories__", "**/*.stories.tsx"]
        }),
        postcss(),
        terser(),
        preserveDirectives(),
    ],
    external: ["react", "react-dom"],
}, {
    input: "./src/index.ts",
    output: {
        dir: "dist/cjs",
        format: "cjs",
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        entryFileNames: (chunkInfo) => {
            if (chunkInfo.name.includes('node_modules')) {
                return chunkInfo.name.replace('node_modules', 'external') + '.js';
            }

            return '[name].js';
        }
    },
    plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: "./tsconfig.json",
            declaration: true,
            declarationDir: 'dist/cjs',
            exclude: ["**/__stories__", "**/*.stories.tsx"]
        }),
        postcss(),
        terser(),
        preserveDirectives(),
    ],
    external: ["react", "react-dom"],
}, {
    input: "dist/esm/index.d.ts",
    output: [{file: "dist/index.d.ts", format: "esm"}],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
}]