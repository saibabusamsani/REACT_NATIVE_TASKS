# Font Setup — React Native CLI

## 1. Add font files
```
src/assets/fonts/
```

## 2. Config (root folder)
```js
// react-native.config.js
module.exports = {
  assets: ['./src/assets/fonts/'],
};
```

## 3. Link fonts
```bash
npx react-native-asset
```

## 4. Rebuild app
```bash
# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## 5. Use in code
```ts
// theme/typography.ts
fontFamily: {
  regular: 'Inter-Regular',
  bold: 'Inter-Bold',
}
```
```tsx
<Text style={{ fontFamily: typography.fontFamily.regular }}>Hello</Text>
```

## 6. If font not visible
- Check `Info.plist` (iOS) has the filename listed
- Check `android/app/src/main/assets/fonts/` has the file
- iOS: `fontFamily` must match PostScript name, not filename
- Rebuild app (not just reload)