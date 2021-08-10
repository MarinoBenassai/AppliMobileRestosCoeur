module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  "transformIgnorePatterns": [
	"node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*|native-base-*)",
  ],
  verbose : true,
  "globals": {
      "__DEV__": true
    },
  "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "ios.ts",
      "ios.tsx",
      "android.ts",
      "android.tsx"
    ],
  setupFilesAfterEnv: ['./jest.setupAfterEnv.js'],
};