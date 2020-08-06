const path = require('path')

module.exports = {
  entry: './main.js',
  mode: 'development',
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use:{
          loader: require.resolve('./css-loader.js')
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-react-jsx',{
              pragma: 'create'
            }],'@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  }
}
