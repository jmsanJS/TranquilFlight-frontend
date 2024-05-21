import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { useSelector } from "react-redux";

import { colors } from "../assets/colors";

export default function HomeScreen() {
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const user = useSelector((state) => state.user.value);
  // console.log(user);
  const handleFocus = (key) => {
    setIsFocused((prevState) => ({ ...prevState, [key]: true }));
  };

  const handleBlur = (key) => {
    setIsFocused((prevState) => ({ ...prevState, [key]: false }));
  };

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
      <View style={styles.searchContainer}>
        <View style={styles.dropShadow}>
          <View
            style={[styles.fieldSet, isFocused.email && styles.focusedInput]}
          >
            <Text style={styles.legend}>N° de vol</Text>
            <TextInput
              cursorColor={colors.light1}
              allowFontScaling={true}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputs}
              onChangeText={(value) => setEmail(value)}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
            ></TextInput>
          </View>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
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
  searchContainer: {
    flex: 3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dropShadow: {
    width: "80%",
    marginBottom: 20,
    borderRadius: 5,
  },
  fieldSet: {
    width: "100%",
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    borderColor: "#000",
    borderColor: colors.dark1,
    backgroundColor: colors.lightGrey,
  },
  legend: {
    position: "absolute",
    top: -10,
    left: 10,
    fontWeight: "600",
    paddingHorizontal: 3,
    fontSize: 11,
    backgroundColor: colors.lightGrey,
    color: colors.dark1,
  },
  inputs: {
    width: "100%",
    justifyContent: "center",
    height: 40,
    color: colors.light1,
  },
  focusedInput: {
    borderWidth: 3,
    borderRadius: 3,
  },
  searchBtn: {
    width: "80%",
    backgroundColor: colors.hot1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  searchBtnText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
