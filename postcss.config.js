export default {
  plugins: {
    'cssnano': {
      preset: ['default', {
        discardComments: { removeAll: true },
        mergeRules: true,
        mergeLonghand: true,
        minifySelectors: true,
        minifyParams: true,
        normalizeWhitespace: true
      }]
    }
  }
};
