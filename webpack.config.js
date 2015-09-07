module.exports = {
  entry: "./js/main.js",
  output: {
    filename: "build.js"
  },
  loaders: [
    { test: /\.json$/, loader: "json" }
  ]
};
