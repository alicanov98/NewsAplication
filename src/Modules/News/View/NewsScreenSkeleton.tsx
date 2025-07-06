import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles';
import NewsCardSkeleton from './NewsCardSkeleton';
import PagesHeader from '../../../components/PagesHeader';


const NewsScreenSkeleton = () => {
  const { colors } = useGlobalStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <View style={styles.contentWrapper}>
        <PagesHeader title="News" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {Array.from({ length: 4 }).map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 22,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    gap: 12,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 16,
  },
});

export default NewsScreenSkeleton;
