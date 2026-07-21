import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-onboarding",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-vitest"
    ],

    framework: {
        name: "@storybook/react-vite",
        options: {
            strictMode: true
        },
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript'
    },

    core: {
        builder: '@storybook/builder-vite',
    },

    async viteFinal(config) {
        // Merge custom configuration into the default config
        const {mergeConfig} = await import('vite');

        return mergeConfig(config, {
            // Add dependencies to pre-optimization
            reactStrictMode: true,
            plugins: [svgr()],
            resolve: {
                alias: {
                    // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
                    '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
                },
            },
        });
    }
};
export default config;
