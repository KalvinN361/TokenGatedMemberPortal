const webpack = require('webpack');
const CracoAlias = require('craco-alias');

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'tsconfig',
                tsConfigPath: './tsconfig.paths.json',
            },
        },
    ],
    output: {
        publicPath: '/test/',
    },
    webpack: {
        plugins: {
            add: [
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                }),
            ],
        },
        configure: {
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        resolve: {
                            fullySpecified: false,
                        },
                    },
                ],
            },
            resolve: {
                fallback: {
                    crypto: require.resolve('crypto-browserify'),
                    stream: require.resolve('stream-browserify'),
                    https: require.resolve('https-browserify'),
                    os: require.resolve('os-browserify/browser'),
                    http: require.resolve('stream-http'),
                    buffer: require.resolve('buffer'),
                    url: false,
                    assert: false,
                },
            },
        },
    },
};
