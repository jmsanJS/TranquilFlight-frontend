import {
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emptyReducer, addFavorite } from "../reducers/favoriteFlights";
import {
  updateTimeFormat,
  updateDistanceUnit,
  updateTemperatureUnit,
  updateNotifications,
  resetSettingsReducer,
} from "../reducers/settings";

import SearchBar from "../components/SearchBar";
import { backendURL } from '../assets/URLs';
import { colors } from "../assets/colors";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const fetchSettings = useCallback(async () => {
    if (user.token !== null) {
      try {
        const response = await fetch(`${backendURL}/user/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            token: user.token,
          }),
        });
        const data = await response.json();
        if (data.result) {
          dispatch(updateTimeFormat(data.userData.timeFormat));
          dispatch(updateDistanceUnit(data.userData.distUnit));
          dispatch(updateTemperatureUnit(data.userData.tempUnit));
          dispatch(updateNotifications(data.userData.globalNotification));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    } else {
      dispatch(resetSettingsReducer());
    }
  }, [dispatch, user.token, user.email]);

  const fetchFavorites = useCallback(async () => {
    if (user.token !== null) {
      try {
        const response = await fetch(`${backendURL}/user/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, token: user.token }),
        });

        const data = await response.json();

        if (data.favorites) {
          dispatch(emptyReducer());

          for (let favorite of data.favorites) {
            dispatch(addFavorite(favorite.flightData));
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
  }, [dispatch, user.token, user.email]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchSettings);

    return () => {
      unsubscribe();
    };
  }, [fetchSettings, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchFavorites);

    return () => {
      unsubscribe();
    };
  }, [fetchFavorites, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/home-image.jpg")}
        style={styles.homeImage}
        alt="Home image"
      >
        {user.firstname ? (
          <Text style={styles.welcomeUserIfConnected}>
            Bonjour {user.firstname}
          </Text>
        ) : null}
      </ImageBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={styles.KeyboardAvoid}
      >
        <SearchBar />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGrey,
  },
  homeImage: {
    resizeMode: "cover",
    width: "100%",
    flex: 5,
  },
  welcomeUserIfConnected: {
    margin: 20,
    color: colors.lightGrey,
    fontSize: 25,
    alignSelf:'flex-end',
    fontWeight:'600',
    fontFamily:'sans-serif-thin'
  },
  KeyboardAvoid: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});