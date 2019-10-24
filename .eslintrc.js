// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "indent": 0,
    "no-unused-vars": ["off", {
      "vars": "local",
      "args": "none",
      "ignoreRestSiblings": false
    }],
    "space-before-function-paren": ["off", {
      "anonymous": "always",
      "named": "always",
      "asyncArrow": "always"
    }],
    "no-fallthrough": ["error", {
      "commentPattern": "break[\\s\\w]*omitted"
    }],
    "no-extend-native": ["error", {
      "exceptions": ["String", "Array"]
    }],
    "no-control-regex": "off",
    "camelcase": ["off", {"properties": "never"}]
  }
}
