const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: [
        './src/**/*.{html,js,jsx,ts,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontSize: {
                '2xs': ['0.675rem', { lineHeight: '1rem' }],
            },
            colors: {
                gold: '#CD9F29',
                fire: '#F73718',
                khaki: '#f2ebc0',
                billBlue: '#252d66',
            },
            fontFamily: {
                sans: ['Helvetica', 'Arial', 'sans-serif'],
                barlow: ['Barlow'],
            },
            spacing: {
                '1/10': '10%',
                '2/10': '20%',
                '3/10': '30%',
                '4/10': '40%',
                '5/10': '50%',
                '6/10': '60%',
                '7/10': '70%',
                '8/10': '80%',
                '9/10': '90%',
            },
            maxWidth: {
                1920: '1920px',
            },
            screens: {
                '3xs': '360px',
                '2xs': '390px',
                xs: '413px',
                '3xl': { raw: '(min-width: 1920px)' },
                short: { raw: '(max-height: 669px)' },
                tall: { raw: '(min-height: 670px)' },
                giant: { raw: '(min-height: 852px)' },
                iphonex: {
                    min: '375px',
                    max: '812px',
                    raw: '(-webkit-min-device-pixel-ratio: 3)',
                },
            },
            zIndex: {
                1: '1',
                60: '60',
                70: '70',
                80: '80',
                90: '90',
                100: '100',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
