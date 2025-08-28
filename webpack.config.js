const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // импорт плагина

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // если используешь стили
        use: ['style-loader', 'css-loader'],
      },
      {
  test: /\.html$/,
  use: 'html-loader'
}
,
      {
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  type: 'asset/resource',
  generator: {
    filename: 'fonts/[name][ext]',
  }, },
  {
  test: /\.(png|jpe?g|gif|webp|svg)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'images/[name][ext]', // папка в dist
  },
}

    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Мои игры',
      template: './src/pages/index.html', // можно указать шаблон
    }),
  ],
  devServer: {
    static: './dist',
     hot: true,             // включить "горячую перезагрузку"
  open: true,            // открывает браузер автоматически
  port: 3000,
   watchFiles: ['src/**/*'],            // можно указать свой порт
  },
  mode: 'development',
};
