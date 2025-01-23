// .storybook/YourTheme.js

import { create } from '@storybook/theming/create';

export default create({
    base: 'dark',
    // Typography
    fontBase: '"Ubuntu", sans-serif',
    fontCode: 'monospace',

    brandTitle: 'Code0 Pictor',
    brandUrl: 'https://code0.tech',
    brandImage: 'https://cdn.discordapp.com/attachments/1187919509298888746/1187921987868299388/Logo.png',
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

    // text colors
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