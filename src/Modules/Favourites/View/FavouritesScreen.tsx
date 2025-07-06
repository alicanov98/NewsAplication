import React, { useCallback, useContext, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/NewsAppNavigator.tsx';
import { FavoritesContext } from '../../../context/FavoritesContext.tsx';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles.ts';
import { useNavigation } from '@react-navigation/native';
import { IArticle } from '../../News/Types/NewsTypes.ts';
import useNetworkStatus from '../../../hooks/useNetworkStatus.ts';
import PagesHeader from '../../../components/PagesHeader.tsx';
import NewsCard from '../../News/View/NewsCard.tsx';
import Loading from '../../../components/Loading.tsx';

const FavouritesScreen = () => {
  const isConnected = useNetworkStatus();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const favouriteContext = useContext(FavoritesContext);
  if (!favouriteContext) {
    throw new Error('Context not found');
  }
  const { favorites, loadFavorites, loading } = favouriteContext;
  const { colors } = useGlobalStyles();

  useEffect(() => {
    loadFavorites();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: IArticle }) => (
      <NewsCard
        data={item}
        disabled={!isConnected}
        onPressCard={() =>
          navigation.navigate('NewsDetailsScreen', { title: item.title })
        }
      />
    ),
    [navigation],
  );

  if (loading) return <Loading />;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.PrimaryColor,
        },
      ]}
    >
      <PagesHeader title={'Favourites'} />
      <FlatList
        data={favorites}
        keyExtractor={(item, index) =>
          item.url || item.title || index.toString()
        }
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: 16 }]}
        refreshing={loading}
        onRefresh={loadFavorites}
        renderItem={renderItem}
        initialNumToRender={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical:22,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 16,
  },
});

export default FavouritesScreen;
