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

export default function HomeScreen({ navigation }) {
  const [isFocused, setIsFocused] = useState({
    flightNumber: false,
    flightDate: false,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateOfFlight, setDateOfFlight] = useState(null);
  const [numberOfFlight, setNumberOfFlight] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const flightsResult = useSelector((state) => state.flightsResult.value);

  const handleFocus = (key) => {
    setIsFocused((prevState) => ({ ...prevState, [key]: true }));
  };

  const handleBlur = (key) => {
    setIsFocused((prevState) => ({ ...prevState, [key]: false }));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDateOfFlight(date.toISOString().slice(0, 10));
    hideDatePicker();
  };

  const handleSearchClick = () => {
    setErrorMessage("");
    fetch(`http://localhost:3000/flights/${numberOfFlight}/${dateOfFlight}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("test fetch front", data);
        if (data.result) {
          console.log("test fetch front dans le if", data);
          dispatch(addFlight(data.flightData));
          navigation.navigate("Résultats de recherche");
        } else if (data.result === false) {
          setErrorMessage(data.error);
        }
      });
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.searchContainer}
      >
        <View style={styles.searchContainer}>
          <View style={styles.dropShadow}>
            <View
              style={[
                styles.fieldSet,
                isFocused.flightNumber && styles.focusedInput,
              ]}
            >
              <Text style={styles.legend}>N° de vol</Text>
              <TextInput
                cursorColor={colors.light1}
                allowFontScaling={true}
                keyboardType="text"
                autoCapitalize="none"
                placeholder="Saisissez votre N° de vol"
                style={styles.inputs}
                onChangeText={(value) => setNumberOfFlight(value)}
                onFocus={() => handleFocus("flightNumber")}
                onBlur={() => handleBlur("flightNumber")}
                value={numberOfFlight}
              ></TextInput>
            </View>
          </View>
          <View style={styles.dropShadow}>
            <View
              style={[
                styles.fieldSet,
                isFocused.flightDate && styles.focusedInput,
              ]}
            >
              <Text style={styles.legend}>Date du vol</Text>
              <View style={styles.calendarInputContainer}>
                <TextInput
                  cursorColor={colors.light1}
                  allowFontScaling={true}
                  keyboardType="date"
                  autoCapitalize="none"
                  placeholder="AAAA-MM-DD"
                  style={styles.inputs}
                  onChangeText={(value) => setDateOfFlight(value)}
                  onFocus={() => handleFocus("flightDate")}
                  onBlur={() => handleBlur("flightDate")}
                  value={dateOfFlight}
                ></TextInput>
                <TouchableOpacity onPress={showDatePicker}>
                  <FontAwesome name="calendar" size={25} color={colors.dark1} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <DateTimePickerModal
              // style={styles.calendarLayout}
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleSearchClick()}
            style={styles.searchBtn}
          >
            <Text style={styles.searchBtnText}>Rechercher</Text>
          </TouchableOpacity>
        </View>
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
  searchContainer: {
    flex: 4,
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
  calendarInputContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
    marginLeft: 2,
  },
  // calendarLayout: {
  //   backgroundColor: colors.dark1,
  //   color: colors.dark1
  // },
  errorMessageContainer: {
    width: "80%",
    marginBottom: 2,
    marginTop: 0,
  },
  errorMessage: {
    color: "red",
    alignSelf: "flex-end",
    fontSize: 11,
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
