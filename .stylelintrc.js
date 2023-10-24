module.exports = {
  extends: 'stylelint-config-airbnb',
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-alphabetical-order': true,
  },
  ignoreFiles: ['**/dist/**'],
};
