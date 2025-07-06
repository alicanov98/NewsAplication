import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/NewsAppNavigator';
import { useGlobalStyles } from '../../../hooks/useGlobalStyles';
import { useNavigation } from '@react-navigation/native';
import GoBackIcon from '../../../assets/images/icons/go-back.svg';
import Skeleton from '../../../components/Skeleton/Skeleton';



const NewsDetailsSkeleton = () => {
  const { colors } = useGlobalStyles();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, { backgroundColor: colors.PrimaryColor }]}>
      <View style={styles.contentWrapper}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackBtn}
          accessibilityRole="button"
          accessibilityLabel="Geri dön"
        >
          <GoBackIcon />
        </TouchableOpacity>

        <View style={styles.skeletonWrapper}>
          {/* Title skeletons */}
          <View style={styles.sectionGap}>
            <Skeleton width="100%" height={30} style={styles.roundedSkeleton} />
            <Skeleton width="90%" height={30} style={styles.roundedSkeleton} />
            <Skeleton width="80%" height={30} style={styles.roundedSkeleton} />
          </View>

          {/* Image and meta skeletons */}
          <View style={styles.sectionGap}>
            <Skeleton width="65%" height={15} style={styles.roundedSkeleton} />
            <Skeleton width="100%" height={200} style={styles.imageSkeleton} />
            <Skeleton width="20%" height={15} style={styles.roundedSkeleton} />
          </View>

          {/* Text block skeletons */}
          <View style={styles.textBlock}>
            <Skeleton width="100%" height={10} style={styles.roundedSkeleton} />
            <Skeleton width="100%" height={10} style={styles.roundedSkeleton} />
            <Skeleton width="100%" height={10} style={styles.roundedSkeleton} />
            <Skeleton width="100%" height={10} style={styles.roundedSkeleton} />
            <Skeleton width="100%" height={10} style={styles.roundedSkeleton} />
            <Skeleton width="56%" height={10} style={styles.roundedSkeleton} />
          </View>
        </View>
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
  goBackBtn: {
    width: 35,
    marginBottom: 16,
  },
  skeletonWrapper: {
    gap: 30,
  },
  sectionGap: {
    gap: 12,
  },
  textBlock: {
    gap: 12,
    marginBottom: 12,
  },
  roundedSkeleton: {
    borderRadius: 12,
  },
  imageSkeleton: {
    borderRadius: 5,
  },
});

export default NewsDetailsSkeleton;
