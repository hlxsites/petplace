module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "prettier",
    "react-refresh",
    "@typescript-eslint",
    "react",
    "unused-imports",
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/unbound-method": "off",
    "unused-imports/no-unused-imports": "error",
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
    },
    {
      files: ["*.js", "*.jsx"],
      parserOptions: {
        project: null,
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx", "*.spec.ts"],
      rules: {
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
  ],
};
