import React, { useEffect, useState } from 'react';
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

  // Yükləmə vəziyyəti və xəbər detallarını saxlayan state-lər
  const [loading, setLoading] = useState(false);
  const [newsDetails, setNewsDetails] = useState<IArticle | null>(null);

  // Parametrdəki başlıq əsasında xəbər detallarını serverdən yükləyirik
  const getNewsDetails = async () => {
    setLoading(true);
    try {
      const res = await NewsService.searchNews(params?.title as string);
      setNewsDetails(res);
    } catch (error) {
      console.error('Xəbər detallarını yükləyərkən xəta baş verdi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Komponent mount olduqda və ya başlıq dəyişdikdə məlumatları yenidən yüklə
  useEffect(() => {
    getNewsDetails();
  }, [params?.title]);

  // Yükləmə davam edirsə, loading komponentini göstər
  if (loading) {
    return <Loading />;
  }

  // Əsas render: geriyə dönmə düyməsi, skrollanabilən məzmun və stil tərtibatı
  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackBtn}>
        <GoBackIcon />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[textStyles.LargeText, styles.title]}>{newsDetails?.title}</Text>

        <Text style={[textStyles.SmallText, styles.authorDate]}>
          By {newsDetails?.author || 'Naməlum'} | {dayjs(newsDetails?.publishedAt).format('DD.MM.YYYY HH:mm')}
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
            {newsDetails?.content?.charAt(0)?.toUpperCase() || ''}
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
});

export default NewsDetailsScreen;
