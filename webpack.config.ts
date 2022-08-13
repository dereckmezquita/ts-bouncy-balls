
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = {
    mode: 'development',
    entry: {
        index: path.resolve(__dirname, 'src/ts/index.ts'),
        styles: path.resolve(__dirname, 'src/styles/main.scss')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    watch: true,
    resolve: {
        extensions: ['.ts', '.js', '.scss']
    },
    output: {
        filename: 'js/[contenthash].js',
        path: path.resolve(__dirname, 'public'),
        clean: true
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({ filename: "css/[contenthash].css" }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            chunks: ['index', 'styles']
        })
    ]
}
