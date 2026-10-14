/** @type {import('ts-jest').JestConfigWithTsJest} */
// prevents error from missing env var
// needs to be here as check is triggered upon import of /src/config/db.ts
process.env.DB_NAME = 'test';
process.env.DB_USER = 'test';

export default {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
