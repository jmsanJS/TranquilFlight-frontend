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
import {backendURL} from '../assets/URLs'

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../reducers/favoriteFlights";
import flightsResult from "../reducers/flightsResult";

export default function TrackingScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const favoriteFlights = useSelector((state) => state.favoriteFlights.value);
  const [weatherData, setWeatherData] = useState(null);

  // useEffect(() => {
  //   const fetchWeatherData = async () => {
  //   const weatherDataResponse = await fetch(`http://localhost:3000/weather/Lyon`);

  //   if (!weatherDataResponse.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }

  //   const data = await weatherDataResponse.json();
  //   setWeatherData(data);
  // }
  // fetchWeatherData();
  // }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherDataResponse = await fetch(
          `${backendURL}/weather/Lyon`
        );
        if (!weatherDataResponse.ok) {
          throw new Error(`HTTP error! Status: ${weatherDataResponse.status}`);
        }
        const data = await weatherDataResponse.json();
        setWeatherData(data.weatherData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWeatherData();
  }, []);
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

        <View style={styles.flightStatusContainer}>
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
      </View>
      <View style={styles.weatherContainer}>
        <View style={styles.weatherHeaderContainer}>
          <View style={styles.weatherHeaderLeftContainer}>
            <View style={styles.timeMiscInfoLeftContainer}>
              <FontAwesome6 name="droplet" style={styles.weatherIcons} />
              <Text style={styles.specificWeatherInfo}>67%</Text>
            </View>
            <View style={styles.timeMiscInfoLeftContainer}>
              <MaterialCommunityIcons
                name="weather-windy"
                style={styles.weatherIcons}
              />
              <Text style={styles.specificWeatherInfo}>24 km/h</Text>
            </View>
          </View>
          <View style={styles.weatherHeaderCenterContainer}>
            <MaterialCommunityIcons
              name="weather-sunny"
              size={40}
              style={{ textAlign: "center" }}
            />
            {weatherData &&
              weatherData.daily &&
              weatherData.daily.data &&
              weatherData.daily.data[0] && (
                <Text style={styles.actualTemperature}>
                  {weatherData.daily.data[0].all_day.temperature}°C
                </Text>
              )}
            {/* <Text style={styles.actualTemperature}>{weatherData.weatherData.daily.data[0].all_day.temperature}°C</Text> */}
          </View>
          <View style={styles.weatherHeaderRightContainer}>
            <Text style={styles.actualDate}>Dim, 25 mai 2024</Text>
            <View>
              <View style={styles.timeMiscInfoRightContainer}>
                <MaterialCommunityIcons
                  name="weather-sunset-up"
                  style={styles.weatherIcons}
                />
                <Text style={styles.specificWeatherInfo}>06:18</Text>
              </View>
              <View style={styles.timeMiscInfoRightContainer}>
                <MaterialCommunityIcons
                  name="weather-sunset-down"
                  style={styles.weatherIcons}
                />
                <Text style={styles.specificWeatherInfo}>21:08</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.weekWeatherContainer}>
          <View style={styles.dayContainer}>
            <Text style={styles.dayName}>LUN</Text>
            <MaterialCommunityIcons
              name="weather-sunny"
              style={styles.weatherIcons}
            />
            <Text style={styles.dayTemperature}>23°C</Text>
            <Text style={styles.dayMiscInfo}>0mm</Text>
            <Text style={styles.dayMiscInfo}>57%</Text>
          </View>
          <View style={styles.dayContainer}>
            <Text style={styles.dayName}>MAR</Text>
            <MaterialCommunityIcons
              name="weather-sunny"
              style={styles.weatherIcons}
            />
            <Text style={styles.dayTemperature}>23°C</Text>
            <Text style={styles.dayMiscInfo}>0mm</Text>
            <Text style={styles.dayMiscInfo}>57%</Text>
          </View>
          <View style={styles.dayContainer}>
            <Text style={styles.dayName}>MER</Text>
            <MaterialCommunityIcons
              name="weather-sunny"
              style={styles.weatherIcons}
            />
            <Text style={styles.dayTemperature}>23°C</Text>
            <Text style={styles.dayMiscInfo}>0mm</Text>
            <Text style={styles.dayMiscInfo}>57%</Text>
          </View>
          <View style={styles.dayContainer}>
            <Text style={styles.dayName}>JEU</Text>
            <MaterialCommunityIcons
              name="weather-sunny"
              style={styles.weatherIcons}
            />
            <Text style={styles.dayTemperature}>23°C</Text>
            <Text style={styles.dayMiscInfo}>0mm</Text>
            <Text style={styles.dayMiscInfo}>57%</Text>
          </View>
          <View style={styles.dayContainer}>
            <Text style={styles.dayName}>VEN</Text>
            <MaterialCommunityIcons
              name="weather-sunny"
              style={styles.weatherIcons}
            />
            <Text style={styles.dayTemperature}>23°C</Text>
            <Text style={styles.dayMiscInfo}>0mm</Text>
            <Text style={styles.dayMiscInfo}>57%</Text>
          </View>
          <View style={styles.dayContainer}>
            <Text style={styles.dayName}>SAM</Text>
            <MaterialCommunityIcons
              name="weather-sunny"
              style={styles.weatherIcons}
            />
            <Text style={styles.dayTemperature}>23°C</Text>
            <Text style={styles.dayMiscInfo}>0mm</Text>
            <Text style={styles.dayMiscInfo}>57%</Text>
          </View>
        </View>
      </View>
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
    justifyContent: "space-between",
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
    width: 50,
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
  weatherContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    elevation: 3,
  },
  weatherHeaderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
  },
  weatherHeaderLeftContainer: {
    width: "33.33%",
    height: "100%",
    justifyContent: "flex-end",
  },
  weatherHeaderCenterContainer: {
    width: "33.33%",
    justifyContent: "space-between",
    height: "100%",
  },
  weatherHeaderRightContainer: {
    width: "33.33%",
    height: "100%",
    justifyContent: "space-between",
  },
  actualTemperature: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark1,
    textAlign: "center",
  },
  actualDate: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.dark1,
    textAlign: "right",
  },
  timeMiscInfoLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeMiscInfoRightContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  weatherIcons: {
    fontSize: 16,
    color: colors.dark1,
  },
  specificWeatherInfo: {
    color: colors.light1,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginLeft: 5,
  },
  weekWeatherContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    // borderRightWidth: 1,
    // borderRightColor: colors.hot1,
    width: "14.28%",
  },
  dayName: {
    color: colors.dark1,
    fontWeight: "600",
  },
  dayTemperature: {
    color: colors.light1,
    fontWeight: "600",
    fontSize: 12,
  },
  dayMiscInfo: {
    color: colors.light1,
    fontSize: 10,
    fontWeight: "600",
  },
});
