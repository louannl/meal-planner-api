module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ["/migrations/*", "/seeders/*"],
  rules: {
    "import/extensions": [
      "error",
      {
        "js": "ignorePackages"
      }
    ],
    "import/no-named-default": 0,
  },
};
