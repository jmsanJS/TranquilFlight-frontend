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

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar></SearchBar>
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
              <Text style={styles.companyText}>Norse Atlantic Airways AS</Text>
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
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    alignItems: "center",
    backgroundColor: colors.lightGrey,
  },
  searchContainer: {
    width: "100%",

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
    justifyContent: "flex-end",
  },
  favoritesTripsContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
});
