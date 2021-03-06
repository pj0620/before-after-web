module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    "import/prefer-default-export": "off",
    // "vue/max-len": [
    //   "error", 
    //   {"code": 120, "template": 120}
    // ],
    "vue/max-len": "off",
    "max-classes-per-file": [
      "error",
      5
    ],
    "no-shadow": "off",
    "import/named": "off",
    "no-non-null-assertion": "off",
  },
};
