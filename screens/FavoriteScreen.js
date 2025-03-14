import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { useEffect } from "react";

import { colors } from "../assets/colors";
import { backendURL } from "../assets/URLs";

import { useDispatch, useSelector } from "react-redux";
import { addFavorite, emptyReducer } from "../reducers/favoriteFlights";
import FlightCard from "../components/FlightCard";

export default function MyFlightsScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const favoriteFlights = useSelector((state) => state.favoriteFlights.value);

  useEffect(() => {
    if (user.token) {
      fetch(`${backendURL}/user/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, token: user.token }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.favorites) {
            dispatch(emptyReducer());
            for (let favorite of data.favorites) {
              dispatch(addFavorite(favorite.flightData));
            }
          }
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      {favoriteFlights.length > 0 ? (
        favoriteFlights.map((item, i) => {
          return <FlightCard key={i} flightData={item}></FlightCard>;
        })
      ) : (
        <Text style={styles.noFavoriteText}>
          Vous n'avez pas de vols suvegardés
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
    backgroundColor: colors.lightGrey,
    padding: 10,
  },
  title: {
    textDecorationLine: "underline",
    fontSize: 20,
    color: colors.dark1,
    marginBottom: 20,
  },
  noFavoriteText: {
    color: colors.dark1,
    fontStyle: "italic",
    paddingTop: 30,
  },
});
