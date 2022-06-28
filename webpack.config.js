const path = require("path")

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    //path: path.resolve(__dirname, "dist"),
    path: "C:/dev/svn/galigeo/trunk/Galigeo-maven-main/ggo_web/src/main/webapp/viewer/api",
    filename: "galigeo-api.js",
    library: "Galigeo",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
        {
            test: /\.(ts|tsx)$/i,
            loader: 'ts-loader',
            exclude: ['/node_modules/'],
        },
        {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  }
}

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};