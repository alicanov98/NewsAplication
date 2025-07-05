import React, { createContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum ThemeModeEnum {
  DARK = 'darkColors',
  LIGHT = 'lightColors',
}

export interface IAppThemeContext {
  theme: ThemeModeEnum;
  changeTheme: (mode: ThemeModeEnum) => void;
}

export const AppThemeContext = createContext<IAppThemeContext | undefined>(
  undefined,
);

interface IAppThemeContextProvider {
  children: ReactNode;
}

const THEME_KEY = '@app_theme';

export const ThemeContextProvider: React.FC<IAppThemeContextProvider> = props => {
  const [theme, setTheme] = useState<ThemeModeEnum>(ThemeModeEnum.DARK);
  const [loading, setLoading] = useState(true); // opsional, yüklənmə üçün

  // AsyncStorage-dan mövcud temayı yüklə
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === ThemeModeEnum.LIGHT || savedTheme === ThemeModeEnum.DARK) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Temanı yükləmək mümkün olmadı:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Tema dəyişəndə AsyncStorage-a yaz
  const changeTheme = async (mode: ThemeModeEnum) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setTheme(mode);
    } catch (error) {
      console.error('Temanı saxlamaq mümkün olmadı:', error);
    }
  };

  if (loading) {
    return null; // ya loading komponenti göstərə bilərsən
  }

  const globals = {
    theme,
    changeTheme,
  };

  return (
    <AppThemeContext.Provider value={globals}>
      {props.children}
    </AppThemeContext.Provider>
  );
};
