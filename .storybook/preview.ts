import type {Preview} from "@storybook/react";

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: 'code0',
            values: [
                {name: 'code0', value: '#030014'}
            ],
        },
        layout: 'centered',
        actions: {argTypesRegex: "^on[A-Z].*"},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
}

export default preview;
