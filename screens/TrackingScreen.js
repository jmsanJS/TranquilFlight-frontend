import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";

import { colors } from "../assets/colors";
import { backendURL } from "../assets/URLs";
import weatherIcons from "../assets/weatherIcons";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import moment from "moment";
import "moment/locale/fr";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../reducers/favoriteFlights";
import flightsResult from "../reducers/flightsResult";
import WeatherCard from "../components/WeatherCard";

export default function TrackingScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const favoriteFlights = useSelector((state) => state.favoriteFlights.value);

  return (
    <View style={styles.container}>
      <View style={styles.flightDescription}>
        <View style={styles.flightHeader}>
          <View style={styles.leftSpace}></View>
          <View>
            <Text style={styles.flightNumber}>AH547</Text>
            <Text style={styles.airline}>Air France</Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => handleNotificationClick()}>
              <FontAwesome name="bell" size={25} color={colors.dark1} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFavoriteClick()}>
              <FontAwesome
                name="heart"
                size={25}
                color={colors.dark1}
                style={styles.heartIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.flightStatusTitle}>Flight Status</Text>
        <View style={styles.routeLineContainer}>
          <FontAwesome6 name="location-dot" style={styles.locationDots} />
          <View style={styles.routeLineAndPlane}>
            <View style={styles.routeLine}></View>
            {/* <FontAwesome5
                name="plane"
                size={20}
                color={colors.dark1}
                style={styles.planeIcon}
              /> */}
          </View>
          <FontAwesome6 name="location-dot" style={styles.locationDots} />
        </View>
      </View>
      {/* <View style={styles.flightStatusContainer}> */}
      <View style={styles.cardsContainer}>
        <View style={styles.flightInfoInDirect}>
          <View style={styles.departureInfo}>
            <Text style={styles.sinceDeparture}>Depuis départ</Text>
            <Text style={styles.distanceAndTimeDepartureInfo}>
              147 km en 0h32
            </Text>
          </View>
          <View style={styles.arrivalInfo}>
            <Text style={styles.untilArrival}>Jusqu'à l'arrivée</Text>
            <Text style={styles.distanceAndTimeArrivalInfo}>
              258 km en 1h24
            </Text>
          </View>
        </View>
        <View style={styles.citiesContainer}>
          <View style={styles.cityContainer}>
            <Text style={styles.city}>Paris</Text>
            <Text style={styles.aeroport}>ORY</Text>
            <Text style={styles.timezone}>CEST (UTC+1:00)</Text>
          </View>
          <View style={styles.flightTicketsImgContainer}>
            <Image
              source={require("../assets/flight-tickets.png")}
              style={styles.flightTicketsImg}
            />
          </View>
          <View style={styles.cityContainer}>
            <Text style={styles.city}>Lyon</Text>
            <Text style={styles.aeroport}>LYS</Text>
            <Text style={styles.timezone}>CEST (UTC+1:00)</Text>
          </View>
        </View>
        <View style={styles.flightScheduleContainer}>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Prévu</Text>
            <Text style={styles.flightScheduleTime}>14:00</Text>
          </View>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Prévu</Text>
            <Text style={styles.flightScheduleTime}>15:02</Text>
          </View>
        </View>
        <View style={styles.flightScheduleContainer}>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Réel</Text>
            <Text style={styles.flightScheduleTime}>14:08</Text>
          </View>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Estimé</Text>
            <Text style={styles.flightScheduleTime}>15:16</Text>
          </View>
        </View>
      </View>
      {/* </View> */}

      <WeatherCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 10,
    padding: 10,
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  flightDescription: {
    justifyContent: "space-between",
    flex: 5,
    width: "100%",
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftSpace: {
    width: "33.33%",
  },
  flightNumber: {
    fontSize: 22,
    color: colors.dark1,
    fontWeight: "600",
  },
  airline: {
    fontSize: 10,
    color: colors.light1,
    textAlign: "center",
    fontWeight: "600",
    marginTop: -3,
  },
  icons: {
    flexDirection: "row",
    width: "33.33%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  heartIcon: {
    marginLeft: 10,
  },
  flightStatusTitle: {
    textAlign: "center",
    color: colors.dark1,
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 12,
  },
  flightStatusContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  routeLineContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  locationDots: {
    color: colors.dark1,
    fontSize: 25,
  },
  routeLineAndPlane: {
    flexDirection: "row",
    width: "75%",
  },
  routeLine: {
    borderStyle: "dashed",
    borderBottomWidth: 1,
    width: "100%",
    borderColor: colors.hot1,
    paddingTop: 20,
    borderRadius: 1,
  },
  cardsContainer: {
    justifyContent: "space-between",
    flex: 10
  },
  flightInfoInDirect: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  sinceDeparture: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.dark1,
  },
  distanceAndTimeDepartureInfo: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.light1,
  },
  untilArrival: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.dark1,
  },
  distanceAndTimeArrivalInfo: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.light1,
  },
  citiesContainer: {
    flexDirection: "row",
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    flex: 2.5,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  cityContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  city: {
    color: colors.dark1,
    fontSize: 18,
    fontWeight: "600",
  },
  aeroport: {
    color: colors.dark1,
    fontSize: 12,
    fontWeight: "600",
  },
  timezone: {
    color: colors.light1,
    fontSize: 10,
    fontWeight: "600",
  },
  flightTicketsImgContainer: {
    justifyContent: "center",
    alignItems: "center",

  },
  flightTicketsImg: {
    width: 60,
    height: 35,
  },
  flightScheduleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    width: "100%",
    elevation: 3,
  },
  timeInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    elevation: 3,
  },
  flightScheduleTitle: {
    color: colors.dark1,
    fontSize: 12,
    fontWeight: "600",
    width: "50%",
    textAlign: "right",
  },
  flightScheduleTime: {
    color: colors.light1,
    fontSize: 14,
    fontWeight: "600",
    width: "50%",
    textAlign: "center",
  },
});
