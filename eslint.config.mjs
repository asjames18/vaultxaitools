import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Remove deprecated/invalid options like useEslintrc and extensions
// Only include valid ESLint config options
export default {
  extends: [
    'next/core-web-vitals',
    // add other configs as needed
  ],
  rules: {
    // your custom rules here
  },
};
