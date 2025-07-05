import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IArticle } from '../Modules/News/Types/NewsTypes.ts';

export interface IFavoritesContext {
  favorites: IArticle[];
  loading: boolean;
  toggleFavorite: (article: IArticle) => Promise<void>;
  loadFavorites: () => Promise<void>;
}

export const FavoritesContext = createContext<IFavoritesContext | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

const FAVORITES_KEY = '@favorites_articles';

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);

  // AsyncStorage-dan favoritləri yükləyir
  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Favoritləri yükləyərkən xəta:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Favorit əlavə/çıxarır və AsyncStorage-a yazır
  const toggleFavorite = async (article: IArticle) => {
    let updatedFavorites: IArticle[];
    if (favorites.some(fav => fav.url === article.url)) {
      updatedFavorites = favorites.filter(fav => fav.url !== article.url);
    } else {
      updatedFavorites = [...favorites, article];
    }
    setFavorites(updatedFavorites);

    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Favoritləri yadda saxlayarkən xəta:', error);
    }
  };

  // Komponent mount olarkən favoritləri yüklə
  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
