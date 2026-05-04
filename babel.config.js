module.exports = function (api) {
  api.cache(true);
  return {
<<<<<<< HEAD
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
=======
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [],
>>>>>>> 9edf1b67d4279cba73bfbf7f43f7de47cd4c97b9
  };
};
