import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import {
  updateTimeFormat,
  updateDistanceUnit,
  updateTemperatureUnit,
  updateNotifications,
  resetSettingsReducer,
} from "../reducers/settings";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFlight } from "../reducers/flightsResult";

import { colors } from "../assets/colors";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import SearchBar from "../components/SearchBar";

export default function HomeScreen({ navigation }) {

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const settings = useSelector((state) => state.settings.value);

  useEffect(() => {
    const fetchSettings = async () => {
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
            console.log("data ==>", data);
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
        console.log("1. L'utilisateur n'est pas connecté.");
      }
    };

    navigation.addListener("focus", fetchSettings);

    return () => {
      navigation.removeListener("focus", fetchSettings);
    };
  }, [dispatch, user, navigation]);



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
        <SearchBar></SearchBar>
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
    color: "white",
    fontSize: 25,
  },
  KeyboardAvoid: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
