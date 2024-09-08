module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
    },
    extends: [
      'airbnb-typescript',
      'plugin:@typescript-eslint/recommended',
      'plugin:jest/recommended',
      'plugin:import/typescript', 
      'plugin:react/recommended',
    ],
    plugins: [
      '@typescript-eslint',
      'jest',
      'react',
      'import',
  
    ],
    rules: {
      // Customize your rules here
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'import/extensions': ['error', 'never', { js: 'always', jsx: 'always' }],
      'import/no-extraneous-dependencies': ['error',  {"devDependencies": true} ],
      'no-console': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
    },
    env: {
      'jest': true,
      'node': true,
    },
  };
  