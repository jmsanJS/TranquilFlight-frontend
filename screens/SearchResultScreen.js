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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

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
        if (data.result) {
          dispatch(addFlight(data.flightData));
          navigation.navigate("Résultats de recherche");
        } else if (data.result === false) {
          setErrorMessage(data.error);
        }
      });
  };
  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.separatorContainer}>
        <View style={styles.separator}></View>
        <Text style={styles.separatorTxt}>Résultats de recherche</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.favoritesTripsContainer}>
        <View style={styles.favoriteTrip}>
          <View style={styles.favoriteTripHeader}>
            <View style={styles.flightNumberContainer}>
              <Text style={styles.flightNumberText}>N0301</Text>
              <Text style={styles.companyText}>Air France</Text>
            </View>
            <Text style={styles.date}>19-06-2024</Text>
            <View style={styles.icons}>
              <FontAwesome name="bell" size={25} color={colors.dark1} />
              <FontAwesome
                name="heart"
                size={25}
                color={colors.dark1}
                style={styles.heartIcon}
              />
            </View>
          </View>
          <View style={styles.favoriteTripDescriptionContainer}>
            <View style={styles.departureInfo}>
              <Text style={styles.departureTime}>14:56</Text>
              <Text style={styles.departureCity}>Paris</Text>
              <Text style={styles.departureAirportCode}>ORY</Text>
            </View>
            <View style={styles.routeLineContainer}>
              <Text style={styles.tripTime}>1h08</Text>
              <View style={styles.routeLineAndTripTime}>
                <View style={styles.routeLine}></View>
                <FontAwesome5
                  name="plane"
                  size={13}
                  color={colors.dark1}
                  style={styles.planeIcon}
                />
              </View>
            </View>
            <View style={styles.arrivalInfo}>
              <Text style={styles.arrivalTime}>16:04</Text>
              <Text style={styles.arrivalCity}>Lyon</Text>
              <Text style={styles.arrivalAirportCode}>LYS</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
    backgroundColor: colors.lightGrey,
  },
  searchContainer: {
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
    marginBottom: 10,
  },
  searchBtnText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  separatorContainer: {
    marginVertical: 5,
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separator: {
    borderColor: colors.dark1,
    borderBottomWidth: 1,
    width: "32%",
  },
  separatorTxt: {
    color: colors.dark1,
    fontSize: 7,
  },
  planeIcon: {
    // paddingTop: 12.5
    justifyContent: "flex-end",
  },
  favoritesTripsContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },

  // Flight Card
  favoriteTrip: {
    backgroundColor: "white",
    width: "80%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  favoriteTripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  flightNumberContainer: {
    width: "33.33%",
  },
  flightNumberText: {
    color: colors.light1,
    fontWeight: "600",
    fontSize: 13,
  },
  companyText: {
    color: colors.dark1,
    fontSize: 11,
    fontWeight: "600",
    marginTop: -5,
  },
  date: {
    width: "33.33%",
    color: colors.dark1,
    fontSize: 13,
    fontWeight: "600",
    width: "33.33%",
    textAlign: "center",
  },
  icons: {
    flexDirection: "row",
    width: "33.33%",
    justifyContent: "flex-end",
  },
  heartIcon: {
    marginLeft: 10,
  },
  favoriteTripDescriptionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  departureInfo: {
    textAlign: "right",
    width: "25%",
  },
  departureTime: {
    textAlign: "right",
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark1,
  },
  departureCity: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "700",
    marginTop: -5,
    color: colors.dark1,
  },
  departureAirportCode: {
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
    marginTop: -3,
    color: colors.dark1,
  },
  routeLineContainer: {
    width: "55%",
    paddingHorizontal: 10,
  },
  routeLineAndTripTime: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
  },
  tripTime: {
    textAlign: "center",
    color: colors.light1,
    fontSize: 12,
    marginTop: 5,
    marginBottom: -5
  },
  routeLine: {
    borderColor: colors.dark1,
    borderBottomWidth: 1,
    width: "100%",
    borderColor: colors.hot1,
  },
  arrivalInfo: {
    width: "25%",
  },
  arrivalTime: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.dark1,
  },
  arrivalCity: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: -5,
    color: colors.dark1,
  },
  arrivalAirportCode: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: -3,
    color: colors.dark1,
  },
});
