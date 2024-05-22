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

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFlight } from "../reducers/flightsResult";

import { colors } from "../assets/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SearchBar from "../components/searchBar";

export default function HomeScreen({ navigation }) {

  const user = useSelector((state) => state.user.value);

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
