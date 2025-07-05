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

  // FavoritesContext-dən lazım olanları götürürük
  const { favorites, loadFavorites, loading } = useContext(FavoritesContext)!;

  // Fokusda və ya "pull to refresh" zamanı favoritləri yeniləyirik
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <Text style={[textStyles.LargeText, styles.title]}>Favourites</Text>

      <FlatList
        data={favorites}
        keyExtractor={item => item.url}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={loadFavorites}
        renderItem={({ item }) => (
          <NewsCard
            data={item}
            onPressCard={() =>
              navigation.navigate('NewsDetailsScreen', { title: item.title })
            }
          />
        )}
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
