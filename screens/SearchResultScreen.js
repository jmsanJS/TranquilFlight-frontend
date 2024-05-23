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

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFlight, removeFlight} from "../reducers/flightsResult";
import { emptyReducer } from '../reducers/favoriteFlights';


import { colors } from "../assets/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome";

import FlightCard from "../components/flightCard";
import SearchBar from "../components/searchBar";


export default function SearchResultScreen({ navigation }) {

  const [flightCardData, setFlightCardData]=useState([])

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const flightData = useSelector((state) => state.flightsResult.value);
  const favoriteFlights = useSelector((state) => state.favoriteFlights.value);
  //dispatch(emptyReducer())

  if(flightData.length>0){
    setFlightCardData(flightData) 
    dispatch(removeFlight());
  }

  //const isFavorite =false
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar/>
      </View>

      <View style={styles.separatorContainer}>
        <View style={styles.separator}></View>
        <Text style={styles.separatorTxt}>Résultats de recherche</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.favoritesTripsContainer}>
        <FlightCard flightData={flightCardData}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.lightGrey,
  },
  searchContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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





