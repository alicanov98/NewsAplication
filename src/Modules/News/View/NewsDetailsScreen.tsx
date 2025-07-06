import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';

import { RootStackParamList } from '../../../navigation/NewsAppNavigator.tsx';
import { IArticle } from '../Types/NewsTypes.ts';
import Loading from '../../../components/Loading.tsx';
import { NewsService } from '../Service/NewsService.ts';
import GoBackIcon from '../../../assets/images/icons/go-back.svg';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles.ts';

const NewsDetailsScreen = () => {
  const { colors, textStyles } = useGlobalStyles();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'NewsDetailsScreen'>>();

  const [loading, setLoading] = useState(false);
  const [newsDetails, setNewsDetails] = useState<IArticle | null>(null);

  const getNewsDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await NewsService.searchNews(params?.title as string);
      setNewsDetails(res);
    } catch (error) {
      console.error('Xəbər detallarını yükləyərkən xəta baş verdi:', error);
    } finally {
      setLoading(false);
    }
  }, [params?.title]);

  useEffect(() => {
    if (params?.title) {
      getNewsDetails();
    }
  }, [getNewsDetails, params?.title]);

  const firstLetter = useMemo(() => {
    return newsDetails?.content?.charAt(0)?.toUpperCase() || '';
  }, [newsDetails?.content]);

  const formattedDate = useMemo(() => {
    return newsDetails?.publishedAt
      ? dayjs(newsDetails.publishedAt).format('DD.MM.YYYY HH:mm')
      : '';
  }, [newsDetails?.publishedAt]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !newsDetails) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.PrimaryColor }]}>
        <Text style={[textStyles.RegularText, { color: colors.PrimaryTextColor }]}>
          Xəbər tapılmadı.
        </Text>
        <TouchableOpacity onPress={getNewsDetails}>
          <Text style={{ color: colors.PrimaryTextColor, marginTop: 10 }}>
            Yenidən cəhd et
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.goBackBtn}
        accessibilityRole="button"
        accessibilityLabel="Geri dön"
      >
        <GoBackIcon />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[textStyles.LargeText, styles.title]}>{newsDetails?.title}</Text>

        <Text style={[textStyles.SmallText, styles.authorDate]}>
          By {newsDetails?.author || 'Naməlum'} | {formattedDate}
        </Text>

        {newsDetails?.urlToImage && (
          <Image
            source={{ uri: newsDetails.urlToImage }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Text style={[textStyles.SmallText, styles.source, { color: colors.Soft }]}>
          {newsDetails?.source?.name}
        </Text>

        <Text style={[textStyles.RegularText, styles.content]}>
          <Text style={[textStyles.RegularText, styles.contentFirstLetter]}>
            {firstLetter}
          </Text>
          {newsDetails?.content?.slice(1) || ''}
          {newsDetails?.description ? '\n\n' + newsDetails.description : ''}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  goBackBtn: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  title: {
    marginBottom: 24,
  },
  authorDate: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 4,
    marginBottom: 12,
  },
  source: {
    fontSize: 13,
    marginBottom: 16,
  },
  content: {
    lineHeight: 24,
  },
  contentFirstLetter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default NewsDetailsScreen;
