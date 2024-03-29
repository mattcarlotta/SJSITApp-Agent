module.exports = {
  testEnvironment: "node",
  verbose: false,
  clearMocks: true,
  moduleNameMapper: {
    "~database/(.*)$": "<rootDir>/database/$1",
    "~database": "<rootDir>/database",
    "~helpers/(.*)$": "<rootDir>/helpers/$1",
    "~helpers": "<rootDir>/helpers",
    "~lib": "<rootDir>/lib/index",
    "~loggers": "<rootDir>/loggers/index",
    "~models/(.*)$": "<rootDir>/models/$1",
    "~models": "<rootDir>/models",
    "~services/(.*)$": "<rootDir>/services/$1",
    "~services": "<rootDir>/services",
    "~templates/(.*)$": "<rootDir>/templates/$1",
    "~templates": "<rootDir>/templates",
    "~types": "<rootDir>/types",
    "~utils/(.*)$": "<rootDir>/utils/$1"
  },
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testMatch: ["**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  transformIgnorePatterns: ["^.+\\.js$"],
  collectCoverageFrom: ["**/*.ts", "!**/*d.ts"],
  coveragePathIgnorePatterns: [
    "<rootDir>/@types",
    "<rootDir>/build",
    "<rootDir>/database",
    "<rootDir>/node_modules",
    "<rootDir>/index.ts"
  ],
  globalSetup: "<rootDir>/database/seedDB/index.ts",
  globalTeardown: "<rootDir>/database/teardownDB/index.ts"
};
