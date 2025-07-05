import { useContext } from 'react';
import GlobalStyles from '../globals/styles';
import { AppThemeContext } from '../context/AppThemeContext';

export const useGlobalStyles = () => {
  const themeContext = useContext(AppThemeContext);

  if (!themeContext) {
    throw new Error('useGlobalStyles must be used within AppThemeContextProvider');
  }

  const { theme } = themeContext;
  const colors = GlobalStyles[theme];

  const textStyles = {
    LargeText: {
      ...GlobalStyles.GlobalTextStyles.LargeText,
      color: colors.PrimaryTextColor,
    },
    MiddleText: {
      ...GlobalStyles.GlobalTextStyles.MiddleText,
      color: colors.PrimaryTextColor,
    },
    RegularText: {
      ...GlobalStyles.GlobalTextStyles.RegularText,
      color: colors.PrimaryTextColorTransparent,
    },
    SmallText: {
      ...GlobalStyles.GlobalTextStyles.SmallText,
      color: colors.SecondaryTextColor,
    },
  };

  return {
    colors,
    textStyles,
  };
};
