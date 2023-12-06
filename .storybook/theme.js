// .storybook/YourTheme.js

import { create } from '@storybook/theming/create';

export default create({
    base: 'dark',
    // Typography
    fontBase: '"Ubuntu", sans-serif',
    fontCode: 'monospace',

    brandTitle: 'Code0 Base UI',
    brandUrl: 'https://code0.tech',
    brandImage: 'https://cdn.discordapp.com/attachments/1173726744130375791/1176472242469740604/Logo.png',
    brandTarget: '_self',

    // UI
    colorPrimary: '#70ffb2',
    colorSecondary: '#70ffb2',
    appBg: '#030014',
    booleanBg: "rgba(255,255,255, .1)",
    appContentBg: '#030014',
    appBorderColor: '#91949A',
    borderBottomColor: '91949A',
    borderLeftColor: '91949A',
    borderRightColor: '91949A',
    borderTopColor: '91949A',
    appBorderRadius: 0,

    // Text colors
    textColor: '#ffffff',
    textInverseColor: '#ffffff',

    // Toolbar default and active colors
    barTextColor: 'rgba(255,255,255, .5)',
    barSelectedColor: 'rgba(255,255,255, .75)',
    barBg: '#030014',

    // Form colors
    inputBg: 'rgba(255,255,255, .1)',
    inputBorder: '#91949A',
    inputTextColor: 'rgba(255,255,255, .5)',
    inputBorderRadius: 2,
});