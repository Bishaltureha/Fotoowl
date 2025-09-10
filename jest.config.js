module.exports = {
 preset: "jest-expo",
 setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
 transformIgnorePatterns: [
   "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
 ],
 collectCoverageFrom: [
   "src/**/*.{js,jsx,ts,tsx}",
   "!src/**/*.d.ts",
   "!src/types/**/*",
   "!src/utils/temp.*"
 ],
 testMatch: [
   "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
   "<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}"
 ],
 moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
 moduleNameMapper: {
   "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
     "identity-obj-proxy",
 },
};