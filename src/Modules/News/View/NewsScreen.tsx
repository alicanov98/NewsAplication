import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { NewsService } from '../Service/NewsService.ts';
import { IArticle, INewsRequestParams } from '../Types/NewsTypes.ts';
import { RootStackParamList } from '../../../navigation/NewsAppNavigator.tsx';
import Loading from '../../../components/Loading.tsx';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles.ts';
import { NewsCard } from '../../../components/NewsScreenComponents/NewsCard.tsx';
import useNetworkStatus from '../../../hooks/useNetworkStatus.ts';


const CACHE_KEY = '@cachedNews';

const NewsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, textStyles } = useGlobalStyles();
  const isConnected = useNetworkStatus();

  const [news, setNews] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requestParams, setRequestParams] = useState<INewsRequestParams>({
    category: 'technology',
    page: 1,
  });

  /**
   * Cache-ə son 5 xəbəri saxla
   */
  const saveCache = async (data: IArticle[]) => {
    try {
      const last5 = data.slice(0, 5);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(last5));
    } catch (e) {
      console.warn('Cache saxlamaq alınmadı:', e);
    }
  };

  /**
   * Cache-dən xəbər yüklə
   */
  const loadCache = async () => {
    try {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (cache) {
        const cachedNews: IArticle[] = JSON.parse(cache);
        setNews(cachedNews);
      } else {
        setNews([]);
      }
    } catch (e) {
      console.warn('Cache yükləmək alınmadı:', e);
    }
  };

  /**
   * Eyni xəbərləri təkrar etməsin deyə
   */
  const mergeArticles = (oldList: IArticle[], newList: IArticle[]) => {
    const map = new Map<string, IArticle>();
    [...newList, ...oldList].forEach(item => {
      map.set(item.url, item);
    });
    return Array.from(map.values());
  };

  const getNews = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      if (!isConnected) {
        await loadCache();

        setError(
          news.length === 0
            ? 'İnternet bağlantısı yoxdur və cache boşdur.'
            : 'İnternet bağlantısı yoxdur.'
        );

        setLoading(false);
        setRefreshing(false);
        return;
      }

      const res = await NewsService.newsList(requestParams);
        
      if (requestParams.page === 1) {
        setNews(res);
        await saveCache(res);
      } else {
        const merged = mergeArticles(news, res);
        setNews(merged);
        await saveCache(merged);
      }

    } catch (e) {
      console.error('Xəbərləri yükləmək alınmadı:', e);

      if (!isConnected) {
        setError('İnternet bağlantısı yoxdur.');
        await loadCache();
      } else {
        setError('Xəbərləri yükləmək alınmadı.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [requestParams, isConnected]);

  useEffect(() => {
    getNews();
  }, [getNews]);

  /**
   * İnternet gələndə error silinsin
   */
  useEffect(() => {
    if (isConnected) {
      setError(null);
    }
  }, [isConnected]);

  const handleEndReached = () => {
    if (!loading && isConnected) {
      setRequestParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleRefresh = () => {
    if (isConnected) {
      setRefreshing(true);
      setRequestParams({ category: 'technology', page: 1 });
    } else {
      setError('İnternet bağlantısı yoxdur.');
      loadCache();
      setRefreshing(false);
    }
  };

  if (loading && requestParams.page === 1) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <Text style={[textStyles.LargeText, styles.title]}>News</Text>

      {error && (
        <Text style={[textStyles.SmallText, { color: 'red', marginBottom: 10 }]}>
          {error}
        </Text>
      )}

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
        ListEmptyComponent={
          !loading ? (
            <Text
              style={[
                textStyles.RegularText,
                {
                  textAlign: 'center',
                  marginTop: 50,
                  color: colors.PrimaryTextColor,
                },
              ]}
            >
              Xəbər tapılmadı.
            </Text>
          ) : null
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
  title: {
    marginBottom: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 16,
  },
});

export default NewsScreen;
