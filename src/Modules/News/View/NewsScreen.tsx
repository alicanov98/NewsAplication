import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';

import { NewsService } from '../Service/NewsService.ts';
import { IArticle, INewsRequestParams } from '../Types/NewsTypes.ts';

import { RootStackParamList } from '../../../navigation/NewsAppNavigator.tsx';
import Loading from '../../../components/Loading.tsx';
import SunIcon from '../../../assets/images/icons/sun.svg';
import MoonIcon from '../../../assets/images/icons/moon.svg';
import {
  AppThemeContext,
  ThemeModeEnum,
} from '../../../context/AppThemeContext.tsx';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles.ts';
import { FavoritesContext } from '../../../context/FavoritesContext.tsx';
import { NewsCard } from '../../../components/NewsScreenComponents/NewsCard.tsx';

const NewsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const themeContext = useContext(AppThemeContext);
  const favoritesContext = useContext(FavoritesContext);

  // Əgər kontekstlər mövcud deyilsə, komponent render etmə
  if (!themeContext || !favoritesContext) return null;

  const { theme, changeTheme } = themeContext;
  const { loadFavorites } = favoritesContext;
  const { colors, textStyles } = useGlobalStyles();

  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<IArticle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [requestParams, setRequestParams] = useState<INewsRequestParams>({
    category: 'technology',
    page: 1,
  });

  // Xəbərləri serverdən gətirir
  const getNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await NewsService.newsList(requestParams);
      if (requestParams.page === 1) {
        setNews(res);
      } else {
        setNews(prevNews => [...prevNews, ...res]);
      }
    } catch (err) {
      console.error('Xəbərləri yükləyərkən xəta baş verdi:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [requestParams]);

  useEffect(() => {
    getNews();
  }, [getNews]);

  // Ekran fokuslandıqda favoritləri yenilə
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleEndReached = () => {
    if (!loading) {
      setRequestParams(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setRequestParams({
      category: 'technology',
      page: 1,
    });
  };

  if (loading && requestParams.page === 1) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <View style={styles.header}>
        <Text style={[textStyles.LargeText, styles.title]}>News</Text>
        <TouchableOpacity
          onPress={() =>
            changeTheme(
              theme === ThemeModeEnum.DARK
                ? ThemeModeEnum.LIGHT
                : ThemeModeEnum.DARK
            )
          }
          style={styles.themeToggleBtn}
        >
          {theme === ThemeModeEnum.DARK ? (
            <SunIcon width={36} height={36} />
          ) : (
            <MoonIcon width={36} height={36} />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={news}
        keyExtractor={item => item.url}
        renderItem={({ item }) => (
          <NewsCard
            data={item}
            onPressCard={() =>
              navigation.navigate('NewsDetailsScreen', { title: item.title })
            }
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.PrimaryColor]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 24,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 16,
  },
});

export default NewsScreen;
