import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // enables all Node.js globals
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/no-duplicates": "warn",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".ts", ".jsx", ".tsx"],
        },
      },
    },
  },
];
