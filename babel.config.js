module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // nativewind/babel disabled for now because it breaks with Expo 51+
  };
};
