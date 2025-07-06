import React, { useCallback, useContext, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AppThemeContext,
  ThemeModeEnum,
} from '../../../context/AppThemeContext.tsx';
import { FavoritesContext } from '../../../context/FavoritesContext.tsx';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles.ts';
import { IArticle } from '../Types/NewsTypes.ts';
import BookmarkWhiteIcon from '../../../assets/images/icons/bookmark-white.svg';
import BookmarkDarkIcon from '../../../assets/images/icons/bookmark-dark.svg';
import dayjs from 'dayjs';

interface INewsCard {
  data: IArticle;
  onPressCard: () => void;
  disabled: boolean;
}

const NewsCard = React.memo(({ data, onPressCard }: INewsCard) => {
  const favoritesContext = useContext(FavoritesContext);
  const themeContext = useContext(AppThemeContext);
  const { colors, textStyles } = useGlobalStyles();
  if (!themeContext || !favoritesContext) {
    throw new Error('Theme context not found');
  }
  const { theme } = themeContext;
  const { favorites, toggleFavorite } = favoritesContext;
  const { title, urlToImage, source, publishedAt } = data;
  const isFavourite = favorites.some(fav => fav.url === data.url);
  const onPressToggleFavorite = useCallback(() => {
    toggleFavorite(data);
  }, [toggleFavorite, data]);

  const dynamicStyles = useMemo(
    () => ({
      sourceText: { color: colors.Soft },
      dateText: { color: colors.Soft },
      titleText: { color: colors.PrimaryTextColor },
    }),
    [colors],
  );

  const formattedDate = useMemo(() => {
    return dayjs(publishedAt).format('DD.MM.YYYY HH:mm');
  }, [publishedAt]);

  return (
    <TouchableOpacity
      onPress={onPressCard}
      style={styles.container}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`News card: ${title}`}
    >
      <Image
        source={
          urlToImage
            ? { uri: urlToImage }
            : require('../../../assets/images/news.webp')
        }
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.headerRow}>
        <Text
          style={[
            textStyles.SmallText,
            styles.sourceText,
            dynamicStyles.sourceText,
          ]}
        >
          {source.name}
        </Text>
        <Text
          style={[
            textStyles.SmallText,
            styles.dateText,
            dynamicStyles.dateText,
          ]}
        >
          {formattedDate}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <Text
          style={[
            textStyles.RegularText,
            styles.titleText,
            dynamicStyles.titleText,
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <TouchableOpacity
          onPress={onPressToggleFavorite}
          style={styles.bookmarkBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={
            isFavourite ? 'Remove news from favorites' : 'Add news to favorites'
          }
        >
          {theme === ThemeModeEnum.DARK ? (
            <BookmarkWhiteIcon
              width={36}
              height={36}
              fill={isFavourite ? colors.PureWhite : colors.PrimaryColor}
            />
          ) : (
            <BookmarkDarkIcon
              width={36}
              height={36}
              fill={isFavourite ? colors.PureBlack : colors.PrimaryColor}
            />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  bookmarkBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsCard;
