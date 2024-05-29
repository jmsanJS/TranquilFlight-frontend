import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import SearchResultScreen from "./screens/SearchResultScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import AccountScreen from "./screens/AccountScreen";
import TrackingScreen from "./screens/TrackingScreen";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { colors } from "./assets/colors";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import flightsResult from "./reducers/flightsResult";
import favoriteFlights from "./reducers/favoriteFlights";
import flightDataTracking from "./reducers/flightDataTracking";
import settings from "./reducers/settings";

// redux-persist imports
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

const reducers = combineReducers({
  user,
  flightsResult,
  favoriteFlights,
  flightDataTracking,
  settings,
});
const persistConfig = {
  key: "TranquilFlight",
  storage: AsyncStorage,
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AccountStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const FavoriteStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function AccountStackScreen() {
  const userReducer = useSelector((state) => state.user.value);

  console.log(userReducer);
  return (
    <AccountStack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.dark1,
        },
        headerTintColor: "white",
        headerTitleAlign: "center",
      })}
    >
      {userReducer.token === null && (
        <>
          <AccountStack.Screen name="Connexion" component={SigninScreen} />
          <AccountStack.Screen name="Créer un compte" component={SignupScreen}
          />
        </>
      )}
      {userReducer.token !== null && (
        <AccountStack.Screen name="Mon Compte" component={AccountScreen} />
      )}
    </AccountStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.dark1,
        },
        headerTintColor: "white",
        headerTitleAlign: "center",
      })}
    >
      <SearchStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <SearchStack.Screen
        name="Résultats de recherche"
        component={SearchResultScreen}
      />
    </SearchStack.Navigator>
  );
}

function FavoriteStackScreen() {
  return (
    <FavoriteStack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.dark1,
        },
        headerTintColor: "white",
        headerTitleAlign: "center",
      })}
    >
      <FavoriteStack.Screen name="Mes favoris" component={FavoriteScreen} />
      <FavoriteStack.Screen name="Suivi du vol" component={TrackingScreen} />
    </FavoriteStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colors.dark1,
        },
        headerTintColor: "white",
        headerTitleAlign: "center",
      })}
    >
      <SettingsStack.Screen
        name="Paramètres utilisateur"
        component={SettingsScreen}
      />
    </SettingsStack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View style={styles.container}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName = "";

                  if (route.name === "Recherche") {
                    iconName = "search";
                  } else if (route.name === "Mes vols") {
                    iconName = "globe";
                  } else if (route.name === "Paramètres") {
                    iconName = "gear";
                  } else if (route.name === "Compte") {
                    iconName = "user";
                  }

                  return (
                    <FontAwesome name={iconName} size={30} color={color} />
                  );
                },
                tabBarStyle: {
                  backgroundColor: colors.dark1,
                  height: "8%",
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
                tabBarActiveBackgroundColor: colors.light1,
                tabBarLabelStyle: {
                  fontSize: 13,
                  paddingBottom: 5,
                },
                tabBarIconStyle: {
                  marginTop: 5,
                },
                headerStyle: {
                  color: "blue", // Specify the height of your custom header
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
              })}
            >
              <Tab.Screen name="Recherche" component={SearchStackScreen} />
              <Tab.Screen name="Mes vols" component={FavoriteStackScreen} />
              <Tab.Screen name="Paramètres" component={SettingsStackScreen} />
              <Tab.Screen name="Compte" component={AccountStackScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
