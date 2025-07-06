import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../components/Skeleton/Skeleton';

const NewsCardSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton
        width="100%"
        height={200}
        style={styles.imageSkeleton}
      />

      <View style={styles.row}>
        <Skeleton width={90} height={10} style={styles.smallSkeleton} />
        <Skeleton width={150} height={10} style={styles.smallSkeleton} />
      </View>
      <Skeleton width="75%" height={15} style={styles.textSkeleton} />
      <Skeleton width="50%" height={15} style={styles.textSkeleton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  imageSkeleton: {
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallSkeleton: {
    borderRadius: 5,
  },
  textSkeleton: {
    borderRadius: 10,
  },
});

export default NewsCardSkeleton;
