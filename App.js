import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import SettingsScreen from './screens/SettingsScreen';
import MyFlightsScreen from './screens/MyFlightsScreen';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {colors} from './assets/colors'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user'

const store = configureStore({
 reducer: { user },  //c'est l'équivalent du state, ici on crée un state friends pour l'exemple qui va contenir la data à partager
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AccountStack = createNativeStackNavigator();

function AccountStackScreen() {
  return (
    <AccountStack.Navigator screenOptions={({route})=>({
      headerStyle:{
        backgroundColor:colors.dark1,
      },
      headerTintColor:'white',
      headerTitleAlign: 'center'
    })}>

      <AccountStack.Screen name="Signin" component={SigninScreen} />
      <AccountStack.Screen name="Signup" component={SignupScreen} />
    </AccountStack.Navigator>
  );
}

export default function App() {

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName = '';

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'MyFlights') {
                iconName = 'globe';
              }
              else if (route.name === 'Settings') {
                iconName = 'gear';
              }
              else if (route.name === 'Account') {
                iconName = 'user';
              }

              return <FontAwesome name={iconName} size={30} color={color} />;
            },
            tabBarStyle:{
              backgroundColor:colors.dark1,
              height:'8%'
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'white',
            tabBarActiveBackgroundColor:colors.light1,
            tabBarLabelStyle:{
              fontSize:13,
              paddingBottom:5,
            },
            tabBarIconStyle:{
              marginTop:5,
            },
            headerStyle: {
              color: 'blue', // Specify the height of your custom header
            },
            headerShown: false,
          })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="MyFlights" component={MyFlightsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            
            <Tab.Screen name="Account" component={AccountStackScreen} />
            
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
