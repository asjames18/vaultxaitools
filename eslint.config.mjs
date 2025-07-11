import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Basic rules - we'll let Next.js handle the rest
    },
  },
];
