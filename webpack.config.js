const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        './src/index.js',
        './src/index.css',
    ],
    mode: 'production',
    optimization: { minimize: true },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src/index.html')
        })
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build'),
    },
};
