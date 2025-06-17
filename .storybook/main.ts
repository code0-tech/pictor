import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
        "@storybook/addon-interactions",
        "@storybook/addon-interactions",
        "@storybook/addon-a11y",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {
            strictMode: true
        },
    },
    docs: {
        autodocs: "tag",
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
            resolve: {
                alias: {
                    // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
                    '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
                },
            },
        });
    },
};
export default config;
