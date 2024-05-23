import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../assets/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite } from "../reducers/favoriteFlights";
import { removeFlight } from "../reducers/flightsResult";

import moment from 'moment';

function FlightCard(props) {
  const user = useSelector((state) => state.user.value);
  const flightData = useSelector((state) => state.flightsResult.value)

  if (props.flightData.length > 0){


  let date1 = moment(new Date(props.flightData[0][0].departure.scheduledTime.utc))
  console.log('date1', date1)
  let date2 = moment(new Date(props.flightData[0][0].arrival.scheduledTime.utc))
  console.log('date2', date2)

  let hours = date2.diff(date1, 'hours')
  console.log('hours', hours)
  var mins = moment.utc(moment(date2, "HH:mm:ss").diff(moment(date1, "HH:mm:ss"))).format("mm")
  console.log('minutes', mins)

  console.log(`${hours}h${mins}`)
  

  const dispatch = useDispatch();

  const handleNotificationClick = () => {
    console.log("notification");
  };

  const handleFavoriteClick = () => {
    
    if (!user.token) {
      dispatch(addFavorite(flightsData));
    } else if (user.token) {
      dispatch(addFavorite(flightsData));
    }
  };

  
    return (
      <View style={styles.favoriteTripContainer}>
        <View style={styles.favoriteTripHeader}>
          <View style={styles.flightNumberContainer}>
            <Text style={styles.flightNumberText}>{props.flightData[0][0].number}</Text>
            <Text style={styles.companyText}>{props.flightData[0][0].airline.name}</Text>
          </View>
          <Text style={styles.date}>{props.flightData[0][0].departure.scheduledTime.local.slice(0,10)}</Text>
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
        <View style={styles.favoriteTripDescriptionContainer}>
          <View style={styles.departureInfo}>
            <Text style={styles.departureTime}>{props.flightData[0][0].departure.scheduledTime.local.slice(11,16)}</Text>
            <Text style={styles.departureCity}>{props.flightData[0][0].departure.airport.municipalityName}</Text>
            <Text style={styles.departureAirportCode}>{props.flightData[0][0].departure.airport.iata}</Text>
          </View>
          <View style={styles.routeLineContainer}>
            <Text style={styles.tripTime}>{`${hours}h${mins}`}</Text>
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
            <Text style={styles.arrivalTime}>{props.flightData[0][0].arrival.scheduledTime.local.slice(11,16)}</Text>
            <Text style={styles.arrivalCity}>{props.flightData[0][0].arrival.airport.municipalityName}</Text>
            <Text style={styles.arrivalAirportCode}>{props.flightData[0][0].arrival.airport.iata}</Text>
          </View>
        </View>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  favoriteTripContainer: {
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
    marginBottom: -5,
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

export default FlightCard;
