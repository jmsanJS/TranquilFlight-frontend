import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "../assets/colors";
import { backendURL } from "../assets/URLs";
import weatherIcons from "../assets/weatherIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import moment from "moment";
import "moment/locale/fr";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { celsiusToFahrenheit } from "../modules/settingsOptions";

function WeatherCard(props) {
  const flightDataTracking = useSelector(
    (state) => state.flightDataTracking.value
  );
  const [weatherData, setWeatherData] = useState(null);

  const settings = useSelector((state) => state.settings.value);

  // useEffect(() => {
  //   const fetchWeatherData = async () => {
  //     try {
  //       const weatherDataResponse = await fetch(
  //         `${backendURL}/weather/${props.city}`
  //       );
  //       if (!weatherDataResponse.ok) {
  //         throw new Error(`HTTP error! Status: ${weatherDataResponse.status}`);
  //       }
  //       const data = await weatherDataResponse.json();
  //       setWeatherData(data.weatherData);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchWeatherData();
  // }, []);

  if (!weatherData) {
    return (
      <View style={styles.downloadingWeatherDataContainer}>
        <Text style={styles.downloadingWeatherData}>
          Chargement des données météorologiques...
        </Text>
      </View>
    );
  }

  moment.locale("fr");

  const currentDay = weatherData.daily.data[0];
  const formattedDate = moment(currentDay.day).format("ddd, DD MMM YYYY");

  const {
    temperature_min,
    temperature_max,
    temperature,
    wind,
    cloud_cover,
    icon,
  } = currentDay.all_day;

  const forcastWeatherData = weatherData.daily.data.map((weekday, i) => {
    if (i > 0) {
      const { temperature, wind, cloud_cover, icon } = weekday.all_day;

      return (
        <View style={styles.dayContainer} key={i}>
          <Text style={styles.dayName}>
            {moment(weekday.day).format("ddd")}
          </Text>
          <Image
            source={weatherIcons[icon]}
            style={styles.forcastWeatherIcon}
            alt="Icône de la météo"
          />
          {settings.temperatureUnit === "°C" ? (
            <Text style={styles.dayTemperature}>
              {Math.round(temperature)}°C
            </Text>
          ) : (
            <Text style={styles.dayTemperature}>
              {celsiusToFahrenheit(temperature)}°F
            </Text>
          )}

          {settings.temperatureUnit === "°C" ? (
            <Text style={styles.dayMiscInfo}>
              {Math.round(temperature_min)}°C
            </Text>
          ) : (
            <Text style={styles.dayTemperature}>
              {celsiusToFahrenheit(temperature_min)}°F
            </Text>
          )}
          {settings.temperatureUnit === "°C" ? (
            <Text style={styles.dayMiscInfo}>
              {Math.round(temperature_max)}°C
            </Text>
          ) : (
            <Text style={styles.dayTemperature}>
              {celsiusToFahrenheit(temperature_max)}°F
            </Text>
          )}
          {/* <Text style={styles.dayMiscInfo}>{temperature_min}°C</Text>
          <Text style={styles.dayMiscInfo}>{temperature_max}°C</Text> */}
        </View>
      );
    }
  });

  return (
    <View style={styles.weatherContainer}>
      <View style={styles.weatherHeaderContainer}>
        <View style={styles.weatherHeaderLeftContainer}>
          <View style={styles.timeMiscInfoLeftContainer}>
            <FontAwesome6
              name="temperature-arrow-down"
              style={styles.temperatureIcons}
            />
            {settings.temperatureUnit === "°C" ? (
              <Text style={styles.specificWeatherInfo}>
                {Math.round(temperature_min)}°C
              </Text>
            ) : (
              <Text style={styles.specificWeatherInfo}>
                {celsiusToFahrenheit(temperature_min)}°F
              </Text>
            )}
          </View>

        </View>
        <View style={styles.weatherHeaderCenterContainer}>
          <Image
            source={weatherIcons[icon]}
            style={styles.todaysWeatherIcon}
            alt="Icône de la météo d'aujourd'hui"
          />
          {settings.temperatureUnit === "°C" ? (
            <Text style={styles.actualTemperature}>
              {Math.round(temperature)}°C
            </Text>
          ) : (
            <Text style={styles.actualTemperature}>
              {celsiusToFahrenheit(temperature)}°F
            </Text>
          )}
        </View>
        <View style={styles.weatherHeaderRightContainer}>
          <Text style={styles.actualDate}>{formattedDate}</Text>
          <View>
            <View style={styles.timeMiscInfoRightContainer}>
              <FontAwesome6
                name="temperature-arrow-up"
                style={styles.temperatureIcons}
              />
              {settings.temperatureUnit === "°C" ? (
                <Text style={styles.specificWeatherInfo}>
                  {Math.round(temperature_max)}°C
                </Text>
              ) : (
                <Text style={styles.specificWeatherInfo}>
                  {celsiusToFahrenheit(temperature_max)}°F
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.weekWeatherContainer}>{forcastWeatherData}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
    flex: 7,
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
    alignItems: "center",
    height: "100%",
  },
  weatherHeaderRightContainer: {
    width: "33.33%",
    height: "100%",
    justifyContent: "space-between",
  },
  downloadingWeatherDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
    flex: 7,
    width: "100%",
    elevation: 3,
  },
  downloadingWeatherData: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.dark1,
  },
  actualTemperature: {
    fontSize: 18,
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
  temperatureIcons: {
    fontSize: 14,
    color: colors.dark1,
  },
  weatherIcons: {
    fontSize: 16,
    color: colors.dark1,
  },
  todaysWeatherIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  forcastWeatherIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
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

export default WeatherCard;
