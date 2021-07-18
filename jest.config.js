module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },
  "testMatch": ["<rootDir>/**/memory.ts", "<rootDir>/**/utils.ts"]
}