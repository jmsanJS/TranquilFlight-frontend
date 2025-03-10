import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { removeFlight } from "../reducers/flightsResult";

import FlightCard from "../components/FlightCard";
import SearchBar from "../components/SearchBar";
import { colors } from "../assets/colors";

export default function SearchResultScreen({ navigation }) {
  const [flightCardData, setFlightCardData] = useState([]);

  const dispatch = useDispatch();
  const flightData = useSelector((state) => state.flightsResult.value);

  if (flightData.airline) {
    setFlightCardData(flightData);
    dispatch(removeFlight());
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar />
      </View>

      <View style={styles.separatorContainer}>
        <View style={styles.separator}></View>
        <Text style={styles.separatorTxt}>Résultats de recherche</Text>
        <View style={styles.separator}></View>
      </View>

      <View style={styles.favoritesTripsContainer}>
        {flightCardData ? <FlightCard flightData={flightCardData} /> : null}
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
    padding: 10,
  },
});
