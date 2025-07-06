import React, { useContext, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IArticle } from '../../News/Types/NewsTypes.ts';
import Loading from '../../../components/Loading.tsx';
import { RootStackParamList } from '../../../navigation/NewsAppNavigator.tsx';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles.ts';
import { FavoritesContext } from '../../../context/FavoritesContext.tsx';
import { NewsCard } from '../../../components/NewsScreenComponents/NewsCard.tsx';

const FavouritesScreen = () => {
  const { colors, textStyles } = useGlobalStyles();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { favorites, loadFavorites, loading } = useContext(FavoritesContext)!;

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const renderItem = useCallback(
    ({ item }: { item: IArticle }) => (
      <NewsCard
        data={item}
        onPressCard={() =>
          navigation.navigate('NewsDetailsScreen', { title: item.title })
        }
      />
    ),
    [navigation]
  );

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <Text style={[textStyles.LargeText, styles.title]}>Favourites</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.url || item.title || index.toString()}
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

export default FavouritesScreen;
