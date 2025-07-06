import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, View, ViewStyle, StyleProp} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '100%',
  style,
}) => {
  const numericWidth = typeof width === 'number' ? width : 300;

  const translateX = useRef(new Animated.Value(-numericWidth)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: numericWidth,
        useNativeDriver: true,
        duration: 1200,
      }),
    ).start();
  }, [numericWidth]);

  return (
    <View
      style={
        StyleSheet.flatten([
          {
            width: width,
            height: height,
            backgroundColor: '#EBEDEE',
            overflow: 'hidden',
          },
          style,
        ]) as StyleProp<ViewStyle>
      }>
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{translateX: translateX}],
        }}>
        <LinearGradient
          colors={['#FDFBFB', '#EBEDEE']}
          style={{
            width: '100%',
            height: '100%',
          }}
          start={{x: 1, y: 1}}
          end={{x: 0, y: 0}}
        />
      </Animated.View>
    </View>
  );
};

export default Skeleton;