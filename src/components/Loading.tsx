import { ActivityIndicator, View } from 'react-native';
import { useGlobalStyles } from '../hooks/useGlobalStyles.ts';

const Loading = () => {
  const { colors } = useGlobalStyles();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        backgroundColor: colors.PrimaryColor,
      }}
    >
      <ActivityIndicator color={colors.PrimaryTextColor} size={'large'} />
    </View>
  );
};

export default Loading;
