import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import HomeScreen from './screens/HomeScreen';
import LinksScreen from './screens/LinksScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerStack = createStackNavigator();

const DrawerStackNavigator = () => (
  <DrawerStack.Navigator initialRouteName="screen1">
    <DrawerStack.Screen name="screen1" component={HomeScreen} />
    <DrawerStack.Screen name="screen2" component={LinksScreen} />
  </DrawerStack.Navigator>
)


const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Root2">
    <Drawer.Screen name="First" component={DrawerStackNavigator} />
    <Drawer.Screen name="Root2" component={BottomTabNavigator} />
  </Drawer.Navigator>
)

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();

        // NAVIGATE DEEP IN ROUTER
        setTimeout(() => {
          containerRef.current.dispatch(
            CommonActions.navigate({
              name: "Root",
              params: {
                screen: "First",
                params: {
                  screen: "screen2"
                }
              },
              source: 'screen1'
            })
          )
          // containerRef.current.navigate('Root', {
          //   screen: 'First',
          //   params: {
          //     screen: 'screen2'
          //   }
          // })
        }, 2000)


      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Root" component={DrawerNavigator} />
        </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
