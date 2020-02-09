module.exports = {
  env: {
    browser: false,
    es6: true,
    jest: true
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    semi: [2, "never"]
  }
};
