import React, { ReactNode, useContext } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useGlobalStyles } from '../hooks/useGlobalStyles.ts';
import { AppThemeContext, ThemeModeEnum } from '../context/AppThemeContext.tsx';

interface ICustomSafeArea {
  children: ReactNode;
}

const CustomSafeArea: React.FC<ICustomSafeArea> = props => {
  const themeContext = useContext(AppThemeContext);
  if (!themeContext) {
    return null;
  }
  const { theme } = themeContext;
  const { colors } = useGlobalStyles();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.PrimaryColor,
      }}
    >
      <StatusBar
        barStyle={
          theme === ThemeModeEnum.DARK ? 'light-content' : 'dark-content'
        }
      />
      {props.children}
    </SafeAreaView>
  );
};

export default CustomSafeArea;
