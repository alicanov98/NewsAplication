import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IArticle, INewsRequestParams } from '../Types/NewsTypes.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/NewsAppNavigator.tsx';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles.ts';
import { useNavigation } from '@react-navigation/native';
import { NewsService } from '../Service/NewsService.ts';
import NewsScreenSkeleton from './NewsScreenSkeleton.tsx';
import useNetworkStatus from '../../../hooks/useNetworkStatus.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagesHeader from '../../../components/PagesHeader.tsx';
import NewsCard from './NewsCard.tsx';



const CACHE_KEY = '@cachedNews';

const NewsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  useEffect(() => {
    const init = async () => {
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const cachedNews: IArticle[] = JSON.parse(cache);
          setNews(cachedNews);
        }
      } catch (err) {
        console.log('Error loading cache:', err);
      } finally {
        if (isConnected) {
          setRefreshing(true);
          setRequestParams({ category: 'technology', page: 1 });
        }
      }
    };
    init();
  }, []);

  const saveCache = async (data: IArticle[]) => {
    try {
      const last5 = data.slice(0, 5);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(last5));
    } catch (err) {
      console.log('Error saving cache:', err);
    }
  };

  const mergeArticles = (oldList: IArticle[], newList: IArticle[]) => {
    const map = new Map<string, IArticle>();
    [...oldList, ...newList].forEach(item => {
      map.set(item.url, item);
    });
    return Array.from(map.values());
  };

  const getNews = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isConnected) {
        setError(
          news.length === 0
            ? 'No internet connection found. Offline mode active'
            : 'No internet connection found.',
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
    } catch (err) {
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [requestParams, isConnected]);

  useEffect(() => {
    getNews();
  }, [requestParams]);

  useEffect(() => {
    if (isConnected) {
      setRequestParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [isConnected]);

  const handleEndReached = () => {
    if (!loading) {
      if (isConnected) {
        setRequestParams(prev => ({ ...prev, page: prev.page + 1 }));
      }
    }
  };

  const handleRefresh = () => {
    if (isConnected) {
      setRefreshing(true);
      setRequestParams({ category: 'technology', page: 1 });
    } else {
      setError('No internet connection found.');
    }
  };

  if (loading && requestParams.page === 1) {
    return <NewsScreenSkeleton />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.PrimaryColor }]}
    >
      <PagesHeader title={'News'} />
      {error && (
        <Text
          style={[textStyles.SmallText, { color: 'red', marginBottom: 10 }]}
        >
          {error}
        </Text>
      )}
      <FlatList
        data={news}
        keyExtractor={item => item.url}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NewsCard
            data={item}
            disabled={!isConnected}
            onPressCard={() => {
              if (isConnected) {
                navigation.navigate('NewsDetailsScreen', {
                  title: item.title,
                });
              } else {
                setError('No internet connection found. Please reconnect');
              }
            }}
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
              No news found !
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
  list: {
    flex: 1,
  },
  listContent: {
    gap: 16,
  },
});

export default NewsScreen;
