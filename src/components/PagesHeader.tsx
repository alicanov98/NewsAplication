import { Text, TouchableOpacity, View } from 'react-native';
import { AppThemeContext, ThemeModeEnum } from '../context/AppThemeContext.tsx';
import SunIcon from '../assets/images/icons/sun.svg';
import MoonIcon from '../assets/images/icons/moon.svg';
import React, { useContext } from 'react';
import { useGlobalStyles } from '../hooks/useGlobalStyles.ts';

interface IPagesHeader {
  title: string;
}

const PagesHeader: React.FC<IPagesHeader> = props => {
  const themeContext = useContext(AppThemeContext);
  if (!themeContext) {
    throw new Error('Context not found');
  }
  const { theme, changeTheme } = themeContext;
  const { colors, textStyles } = useGlobalStyles();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text
        style={{
          ...textStyles.LargeText,
          marginBottom: 24,
        }}
      >
          {props.title}
      </Text>
      <TouchableOpacity
        onPress={() =>
          changeTheme(
            theme === ThemeModeEnum.DARK
              ? ThemeModeEnum.LIGHT
              : ThemeModeEnum.DARK,
          )
        }
        style={{ width: 36, height: 36 }}
      >
        {theme === ThemeModeEnum.DARK ? (
          <SunIcon width={36} height={36} />
        ) : (
          <MoonIcon width={36} height={36} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PagesHeader;
