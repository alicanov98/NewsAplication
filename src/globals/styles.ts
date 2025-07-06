import { StyleSheet } from 'react-native';

const darkColors = {
  PrimaryColor: '#121212',
  SecondaryColor: '#1E1E1E',
  Soft: '#4CAF50',
  Overlay: '#333333',
  PrimaryTextColor: '#E0E0E0',
  PrimaryTextColorTransparent: '#E0E0E080',
  SecondaryTextColor: '#A0A0A0',
  TertiaryTextColor: '#6C6C6C',
  SkletonBgColor: '#1C1C1E',
  SkletonOverlayColor: '#2C2C2E',
};

const lightColors = {
  PrimaryColor: '#FFFFFF',
  SecondaryColor: '#F5F5F5',
  Soft: '#1E88E5',
  Overlay: '#E0E0E0',
  PrimaryTextColor: '#212121',
  PrimaryTextColorTransparent: '#21212180',
  SecondaryTextColor: '#616161',
  TertiaryTextColor: '#9E9E9E',
  SkletonBgColor: '#EBEDEE',
  SkletonOverlayColor: '#FDFBFB',
};

const GlobalTextStyles = StyleSheet.create({
  LargeText: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    fontSize: 32,
  },
  MiddleText: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
    fontSize: 24,
  },
  RegularText: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
    fontSize: 14,
  },
  SmallText: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
    fontSize: 12,
  },
});

const GlobalStyles = {
  darkColors,
  lightColors,
  GlobalTextStyles,
};

export default GlobalStyles;
