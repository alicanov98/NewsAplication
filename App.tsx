import { NavigationContainer } from '@react-navigation/native';
import NewsAppNavigator from './src/navigation/NewsAppNavigator.tsx';
import CustomSafeArea from './src/components/CustomSafeArea.tsx';
import { ThemeContextProvider } from './src/context/AppThemeContext.tsx';
import { FavoritesProvider } from './src/context/FavoritesContext.tsx';

function App() {
  return (
    <ThemeContextProvider>
         <FavoritesProvider>
      <NavigationContainer>
        <CustomSafeArea>
          <NewsAppNavigator />
        </CustomSafeArea>
      </NavigationContainer>
      </FavoritesProvider>
    </ThemeContextProvider>
  );
}

export default App;
