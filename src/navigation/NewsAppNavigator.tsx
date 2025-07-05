import React, { useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewsScreen from '../Modules/News/View/NewsScreen.tsx';
import FavouritesScreen from '../Modules/Favourites/View/FavouritesScreen.tsx';
import NewsDetailsScreen from '../Modules/News/View/NewsDetailsScreen.tsx';
import FavouritesIcon from '../assets/images/icons/favourites-icon.svg';
import FavouritesIconActive from '../assets/images/icons/favourites-icon-active.svg';
import NewsIcon from '../assets/images/icons/news-icon.svg';
import NewsIconActive from '../assets/images/icons/news-icon-active.svg';
import { useGlobalStyles } from '../hooks/useGlobalStyles.ts';

const Stack = createNativeStackNavigator();

const NewsAppBottomTabNavigation = createBottomTabNavigator();

export type RootStackParamList = {
  NewsNavigator: undefined;
  NewsScreen: undefined;
  NewsDetailsScreen: { title: string } | undefined;
  FavouritesNavigator: undefined;
  FavouritesScreen: undefined;
};

const NewsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="NewsDetailsScreen" component={NewsDetailsScreen} />
    </Stack.Navigator>
  );
};

const FavouritesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavouritesScreen" component={FavouritesScreen} />
      <Stack.Screen name="NewsDetailsScreen" component={NewsDetailsScreen} />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  const { colors } = useGlobalStyles();

  const renderBottomTabIcon = useCallback(
    (iconName: string, focused?: boolean) => {
      switch (iconName) {
        case 'news':
          return focused ? <NewsIconActive /> : <NewsIcon />;
        case 'favourites':
          return focused ? <FavouritesIconActive /> : <FavouritesIcon />;
        default:
          return null;
      }
    },
    [],
  );

  return (
    <NewsAppBottomTabNavigation.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.SecondaryColor,
        },
        tabBarActiveTintColor: colors.Soft,
      }}
    >
      <NewsAppBottomTabNavigation.Screen
        name={'NewsNavigator'}
        component={NewsNavigator}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ focused }) => renderBottomTabIcon('news', focused),
        }}
      />
      <NewsAppBottomTabNavigation.Screen
        name={'FavouritesNavigator'}
        component={FavouritesNavigator}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ focused }) =>
            renderBottomTabIcon('favourites', focused),
        }}
      />
    </NewsAppBottomTabNavigation.Navigator>
  );
};

const NewsAppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default NewsAppNavigator;
