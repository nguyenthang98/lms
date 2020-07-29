'use strict'
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    entry: [
        './src/app.js',
    ],
    output: {
        path: __dirname + "/dist",
        filename: "index.bundle.js"
    },
    devServer: {
        contentBase: __dirname + '/dist',
        watchContentBase: true,
        compress: true,
        bonjour: true,
        clientLogLevel: 'debug',
        port: 5050
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    /*
    resolve: {
        alias: {
            "vue$": "node_modules/vue/dist/vue.esm.js"
        }
    }
    */
}
