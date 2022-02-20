/* eslint-disable import/no-commonjs */

// Config
module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV === 'development');

  const callerName = api.caller((caller) => caller && caller.name);

  return {
    // Preset ordering is reversed (last to first).
    presets: [
      [
        '@babel/preset-env',
        {
          exclude: ['@babel/plugin-proposal-dynamic-import'],
          targets: {
            node: callerName === 'babel-loader' ? '12' : 'current'
          },
          modules: 'commonjs'
        }
      ],
      '@babel/preset-typescript'
    ]
  };
};
