/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ["react", "@typescript-eslint", "jsx-a11y", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier", // prettier와 충돌 방지
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // 여기에 필요 시 추가 규칙 설정
    "react/react-in-jsx-scope": "off", // React 17+ JSX 자동 설정
    "react-refresh/only-export-components": "off"
  },
};
