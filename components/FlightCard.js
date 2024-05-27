import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { colors } from "../assets/colors";
import {backendURL} from '../assets/URLs'

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../reducers/favoriteFlights";
import { addFlight, emptyFlight } from "../reducers/flightDataTracking";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

function FlightCard(props) {

  const navigation = useNavigation();

  const user = useSelector((state) => state.user.value);
  const favoriteFlights = useSelector((state) => state.favoriteFlights.value);

  const [isFavorited, setIsFavorited] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.flightData && props.flightData.length > 0) {
      const isFavorite = favoriteFlights.some(favorite => favorite[0][0].number === props.flightData[0][0].number);
      setIsFavorited(isFavorite);
    }
  }, [favoriteFlights, props.flightData]);

  // Fournir une valeur par défaut à props.flightData
  const flightData = props.flightData || [];

  if (flightData.length === 0) {
    return null; // ou un indicateur de chargement
  }

  let date1 = moment(new Date(flightData[0][0].departure.scheduledTime.utc));
  let date2 = moment(new Date(flightData[0][0].arrival.scheduledTime.utc));
  let hours = date2.diff(date1, 'hours');
  var mins = moment.utc(moment(date2, "HH:mm:ss").diff(moment(date1, "HH:mm:ss"))).format("mm");

  const handleNotificationClick = () => {
    console.log("notification");
  };

  const handleFavoriteClick = () => {
    if(user.token){

      if (!isFavorited) {
        fetch(`${backendURL}/user/favorite`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flightNumber: flightData[0][0].number, flightData: flightData, email: user.email, token: user.token }),
        })
        .then((response) => response.json())
        .then(dispatch(addFavorite(flightData)))
  
      } else {
        fetch(`${backendURL}/user/favorite`,{
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flightNumber: flightData[0][0].number, email: user.email, token: user.token }),
        })
        .then((response) => response.json())
        .then(()=>{
          console.log('delete',flightData[0][0].number)
          dispatch(removeFavorite(flightData[0][0].number))
        })
      }

    }else{
      if (!isFavorited) {
        dispatch(addFavorite(flightData))
      } else {
        dispatch(removeFavorite(flightData[0][0].number))
      }
    }
  };

  let iconStyle = { color: 'grey', marginLeft: 10 };
  if (isFavorited) {
    iconStyle = { color: 'red', marginLeft: 10 };
  }

  const handleFlightCardClick = async () => {
    dispatch(emptyFlight())
    dispatch(addFlight({flightNumber:flightData[0][0].number , date:flightData[0][0].departure.scheduledTime.local.slice(0,10)}))
    navigation.navigate('Suivi du vol')
  }

  return (
    <TouchableOpacity onPress={()=>handleFlightCardClick()} style={styles.favoriteTripContainer}>
      <View style={styles.favoriteTripHeader}>
        <View style={styles.flightNumberContainer}>
          <Text style={styles.flightNumberText}>{flightData[0][0].number}</Text>
          <Text style={styles.companyText}>{flightData[0][0].airline.name}</Text>
        </View>
        <Text style={styles.date}>{flightData[0][0].departure.scheduledTime.local.slice(0, 10)}</Text>
        <View style={styles.icons}>
          <TouchableOpacity onPress={handleNotificationClick}>
            <FontAwesome name="bell" size={25} color={colors.dark1} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavoriteClick}>
            <FontAwesome
              name="heart"
              size={25}
              style={iconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.favoriteTripDescriptionContainer}>
        <View style={styles.departureInfo}>
          <Text style={styles.departureTime}>{flightData[0][0].departure.scheduledTime.local.slice(11, 16)}</Text>
          <Text style={styles.departureCity}>{flightData[0][0].departure.airport.municipalityName}</Text>
          <Text style={styles.departureAirportCode}>{flightData[0][0].departure.airport.iata}</Text>
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
          <Text style={styles.arrivalTime}>{flightData[0][0].arrival.scheduledTime.local.slice(11, 16)}</Text>
          <Text style={styles.arrivalCity}>{flightData[0][0].arrival.airport.municipalityName}</Text>
          <Text style={styles.arrivalAirportCode}>{flightData[0][0].arrival.airport.iata}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  favoriteTripContainer: {
    backgroundColor: "white",
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    elevation:3,
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
