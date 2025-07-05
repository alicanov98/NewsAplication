import React, { useContext } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import BookmarkWhiteIcon from '../../assets/images/icons/bookmark-white.svg';
import BookmarkDarkIcon from '../../assets/images/icons/bookmark-dark.svg';
import { useGlobalStyles } from '../../hooks/useGlobalStyles.ts';
import { AppThemeContext, ThemeModeEnum } from '../../context/AppThemeContext.tsx';
import { FavoritesContext } from '../../context/FavoritesContext.tsx';
import { IArticle } from '../../Modules/News/Types/NewsTypes.ts';

interface INewsCard {
  data: IArticle;
  onPressCard: () => void;
}

export const NewsCard: React.FC<INewsCard> = ({ data, onPressCard }) => {
  const themeContext = useContext(AppThemeContext);
  const favoritesContext = useContext(FavoritesContext);

  if (!themeContext || !favoritesContext) return null;

  const { theme } = themeContext;
  const { colors, textStyles } = useGlobalStyles();
  const { title, urlToImage, source, publishedAt } = data;
  const { favorites, toggleFavorite } = favoritesContext;

  const isFavorited = favorites.some(fav => fav.url === data.url);

  
  const iconFillColor = isFavorited
    ? (theme === ThemeModeEnum.DARK ? colors.PrimaryTextColor : colors.PrimaryTextColor)
    : 'none';

  return (
    <TouchableOpacity onPress={onPressCard} style={styles.container} activeOpacity={0.8}>
      {urlToImage && (
        <Image
          source={{ uri: urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.headerRow}>
        <Text style={[textStyles.SmallText, styles.sourceText, { color: colors.Soft }]}>
          {source.name}
        </Text>
        <Text style={[textStyles.SmallText, styles.dateText, { color: colors.Soft }]}>
          {dayjs(publishedAt).format('DD.MM.YYYY HH:mm')}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <Text
          style={[textStyles.RegularText, styles.titleText, { color: colors.PrimaryTextColor }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <TouchableOpacity onPress={() => toggleFavorite(data)} style={styles.bookmarkBtn} activeOpacity={0.7}>
          {theme === ThemeModeEnum.DARK ? (
            <BookmarkWhiteIcon width={36} height={36} fill={iconFillColor} />
          ) : (
            <BookmarkDarkIcon width={36} height={36} fill={iconFillColor} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

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
