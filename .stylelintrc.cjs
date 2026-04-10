module.exports = {
    extends: [
      'stylelint-config-standard-scss',
    ],
    plugins: [
      'stylelint-order',
    ],
    rules: {
      'order/properties-order': [{
        properties: require('./scss-properties-order.json')
      }],
      'custom-property-empty-line-before': null,
      'selector-pseudo-class-no-unknown': [true,
        {
          ignorePseudoClasses: ['global']
        }
      ],
      'color-function-notation': ['modern', {
        ignore: ['with-var-inside'],
      }],
      'alpha-value-notation': 'number',
      'selector-class-pattern': null,
      'rule-empty-line-before': ['always', {
        ignore: ['after-comment', 'first-nested'],
      }],
    },
  }
  