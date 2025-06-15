import './global.scss';
import type {Preview} from "@storybook/react";

const preview: Preview = {
    parameters: {
        layout: 'centered',
        actions: {argTypesRegex: "^on[A-Z].*"},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // Optional selector to inspect
            element: '#storybook-root',
            config: {
                rules: [
                    {id: 'landmark-one-main', enabled: false}, // not relevant to single components
                    {id: 'page-has-heading-one', enabled: false}, // not relevant to single components
                    {id: 'region', enabled: false}, // not relevant to single components
                    {id: 'aria-allowed-attr', enabled: false} // disable all aria checks
                ],
            },
        },
    },
}

export default preview;
