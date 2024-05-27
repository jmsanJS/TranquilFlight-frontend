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
  const flightDataTracking = useSelector((state) => state.flightDataTracking.value);

  const [departureLength, setDepartureLength]=useState('0')
  const [arrivalLength, setArrivalLength]=useState('0')
  const [fromDepartureHours, setFromDepartureHours]=useState()
  const [fromDepartureMinutes, setFromDepartureMinutes]=useState()
  const [toArrivalHours, setToArrivalHours]=useState()
  const [toArrivalMinutes, setToArrivalMinutes]=useState()
  const [totalFlightHours, setTotalFlightHours]=useState()
  const [totalFlightMinutes, setTotalFlightMinutes]=useState()

  let flightData = [
    {
      "greatCircleDistance": {
        "meter": 1475075.27,
        "km": 1475.08,
        "mile": 916.57,
        "nm": 796.48,
        "feet": 4839485.8
      },
      "departure": {
        "airport": {
          "icao": "EBBR",
          "iata": "BRU",
          "name": "Brussels ",
          "shortName": "Brussels",
          "municipalityName": "Brussels",
          "location": {
            "lat": 50.9014,
            "lon": 4.484439
          },
          "countryCode": "BE"
        },
        "scheduledTime": {
          "utc": "2024-05-27 08:30Z",
          "local": "2024-05-27 10:30+02:00"
        },
        "revisedTime": {
          "utc": "2024-05-27 08:52Z",
          "local": "2024-05-27 10:52+02:00"
        },
        "runwayTime": {
          "utc": "2024-05-27 08:53Z",
          "local": "2024-05-27 10:53+02:00"
        },
        "checkInDesk": "05",
        "quality": [
          "Basic",
          "Live"
        ]
      },
      "arrival": {
        "airport": {
          "icao": "LPPR",
          "iata": "OPO",
          "name": "Porto Francisco de Sá Carneiro",
          "shortName": "Francisco de Sá Carneiro",
          "municipalityName": "Porto",
          "location": {
            "lat": 41.2481,
            "lon": -8.681389
          },
          "countryCode": "PT"
        },
        "scheduledTime": {
          "utc": "2024-05-27 11:05Z",
          "local": "2024-05-27 12:05+01:00"
        },
        "revisedTime": {
          "utc": "2024-05-27 10:59Z",
          "local": "2024-05-27 11:59+01:00"
        },
        "terminal": "1",
        "quality": [
          "Basic",
          "Live"
        ]
      },
      "lastUpdatedUtc": "2024-05-27 10:11Z",
      "number": "SN 3811",
      "callSign": "BEL1MR",
      "status": "Arrived",
      "codeshareStatus": "IsOperator",
      "isCargo": false,
      "aircraft": {
        "reg": "OO-SNF",
        "modeS": "44CDC6",
        "model": "Airbus A320"
      },
      "airline": {
        "name": "Brussels",
        "iata": "SN",
        "icao": "BEL"
      }
    }
  ]

  useEffect(() => {

    // fetch(`${backendURL}/flights/${flightDataTracking.flightNumber}/${flightDataTracking.date}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         if (data.result) {
    //           flightData=data.flightData
    //           console.log('data---->',flightData)
    //         } else if (data.result === false) {
    //           alert("Une erreur s'est produite, merci de ré-essayer")
    //           navigation.navigate('Recherche')
    //         }
    //     });
    
    const lastUpdate = moment(lastUpdatedUtc)
    const departureTime = moment(departure.revisedTime.utc)
    const arrivalTime = moment(arrival.revisedTime.utc)

    const flightDuration = moment.duration(lastUpdate.diff(departureTime))
    setFromDepartureHours(flightDuration.hours())
    setFromDepartureMinutes(flightDuration.minutes())

    const remainingFlightDuration = moment.duration(arrivalTime.diff(lastUpdate))
    setToArrivalHours(remainingFlightDuration.hours())
    setToArrivalMinutes(remainingFlightDuration.minutes())

    const totalFlightTime = moment.duration(arrivalTime.diff(departureTime))
    setTotalFlightHours(totalFlightTime.hours())
    setTotalFlightMinutes(totalFlightTime.minutes())

    const flightDurationInMunutes = moment.duration(lastUpdate.diff(departureTime)).asMinutes()
    const totalFlightDurationInMinutes = moment.duration(arrivalTime.diff(departureTime)).asMinutes()

    if (lastUpdate>arrivalTime){
      setDepartureLength('90')
      setArrivalLength('0')
    }else{
      setDepartureLength(`${Math.round(flightDurationInMunutes/totalFlightDurationInMinutes*100*0.9)}`)
      setArrivalLength(`${90-Math.round(flightDurationInMunutes/totalFlightDurationInMinutes*100*0.9)}`)
    }
  }, []);

  const {
    number,
    airline,
    status,
    departure,
    arrival,
    greatCircleDistance,
    lastUpdatedUtc,
  } = flightData[0];


  return (
    <View style={styles.container}>
      <View style={styles.flightDescription}>
        <View style={styles.flightHeader}>
          <View style={styles.leftSpace}></View>
          <View>
            <Text style={styles.flightNumber}>{number}</Text>
            <Text style={styles.airline}>{airline.name}</Text>
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
        <Text style={styles.flightStatusTitle}>{status === 'Unknown' ? 'En attente de départ' : status}</Text>
        <Text style={styles.flightLengthDescription}>{`${Math.round(Number(greatCircleDistance.km))} km en ${totalFlightHours}h${totalFlightMinutes} min`}</Text>
        <View style={styles.routeContainer}>

          <View style={styles.locationContainerLeft}>
            <FontAwesome6 name="location-dot" style={styles.locationDots} />
            <Text style={styles.sinceDeparture}>{`${fromDepartureHours}h${fromDepartureMinutes}min depuis départ`}</Text>
          </View>

          <View style={styles.routeLineAndPlaneContainer}>
            <View style={{width:`${departureLength}%`, borderBottomColor:colors.hot1, borderBottomWidth:2 }}></View>
            <View style={styles.planeIconContainer}>
              <FontAwesome5 name="plane" size={19} color={colors.dark1} style={styles.planeIcon} />
            </View>
            <View style={{width:`${arrivalLength}%`, borderBottomColor:colors.dark1, borderBottomWidth:2 }}></View>
          </View>

          <View style={styles.locationContainerRight}>
            <FontAwesome6 name="location-dot" style={styles.locationDots} />
            <Text style={styles.untilArrival}>{`${toArrivalHours}h${toArrivalMinutes} min restantes`}</Text>
          </View>

        </View>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.flightInfoInDirect}>
          
          <View style={styles.arrivalInfo}>
          </View>
        </View>
        <View style={styles.citiesContainer}>
          <View style={styles.cityContainer}>
            <Text style={styles.city}>{departure.airport.municipalityName.length>8 ? `${departure.airport.municipalityName.slice(0,7)}...` : departure.airport.municipalityName}</Text>
            <Text style={styles.aeroport}>{departure.airport.iata}</Text>
            <Text style={styles.timezone}>{`UTC${departure.scheduledTime.local.slice(-6)}`}</Text>
          </View>
          <View style={styles.flightTicketsImgContainer}>
            <Image
              source={require("../assets/flight-tickets.png")}
              style={styles.flightTicketsImg}
            />
          </View>
          <View style={styles.cityContainer}>
            <Text style={styles.city}>{arrival.airport.municipalityName.length>8 ? `${arrival.airport.municipalityName.slice(0,7)}...` : arrival.airport.municipalityName}</Text>
            <Text style={styles.aeroport}>{arrival.airport.iata}</Text>
            <Text style={styles.timezone}>{`UTC${arrival.scheduledTime.local.slice(-6)}`}</Text>
          </View>
        </View>
        <View style={styles.flightScheduleContainer}>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Prévu</Text>
            <Text style={styles.flightScheduleTime}>{departure.scheduledTime ? `${departure.scheduledTime.local.slice(11,16)}` : '-'}</Text>
          </View>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Prévu</Text>
            <View style={styles.localAndForeignTimeContainer}>
              <Text style={styles.flightScheduleTime}>{arrival.scheduledTime ? `${arrival.scheduledTime.local.slice(11,16)}` : '-'}</Text>
              <Text style={styles.flightScheduleLocalTime}>{arrival.scheduledTime ? `${moment(arrival.scheduledTime.local).toISOString().slice(11,16)} (${arrival.airport.countryCode})` : '-'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.flightScheduleContainer}>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Réel</Text>
            <Text style={styles.flightScheduleTime}>{departure.revisedTime ? `${departure.revisedTime.local.slice(11,16)}` : '-'}</Text>
          </View>
          <View style={styles.timeInfoContainer}>
            <Text style={styles.flightScheduleTitle}>Estimé</Text>
            <View style={styles.localAndForeignTimeContainer}>
              <Text style={styles.flightScheduleTime}>{arrival.revisedTime ? `${arrival.revisedTime.local.slice(11,16)}` : '-'}</Text>
              <Text style={styles.flightScheduleLocalTime}>{arrival.revisedTime ? `${moment(arrival.revisedTime.local).toISOString().slice(11,16)} (${arrival.airport.countryCode})` : '-'}</Text>
            </View>
          </View>
        </View>
      </View>
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
    flexDirection:'column',
    justifyContent:'space-evenly'
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
    textAlign:'center',
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
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },
  flightLengthDescription:{
    alignSelf:'center',
    fontSize:10,
    fontWeight:'600',
    color:colors.light1,
  },
  flightStatusContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  routeContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: 'space-between',
  },
  locationContainerLeft:{
    width:'15%',
    alignItems:'flex-end',
  },
  locationContainerRight:{
    width:'15%',
    alignItems:'flex-start',
  },
  locationDots: {
    color: colors.dark1,
    fontSize: 25,
  },
  routeLineAndPlaneContainer: {
    flexDirection: "row",
    alignItems:'center',
    width: "70%",
  },
  planeIconContainer:{
    width:'10%',
    justifyContent:'center',
    alignItems:'center',
  },
  planeIcon:{
    color:colors.hot1
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
    textAlign:'right',
  },
  untilArrival: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.dark1,
    alignSelf:'flex-start',
    //textAlign:'left',
  },
  distanceAndTimeArrivalInfo: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.light1,
    textAlign:'left',
  },
  citiesContainer: {
    flexDirection: "row",
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    flex: 2.5,
    justifyContent: "space-evenly",
    alignItems: "center",
    elevation: 3,
  },
  cityContainer: {
    justifyContent: "center",
    alignItems: "center",
    width:'40%',
  },
  city: {
    color: colors.dark1,
    fontSize: 18,
    fontWeight: "600",
    textAlign:'center',
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
    width:'20%',

  },
  flightTicketsImg: {
    width: 60,
    height: 35,
  },
  flightScheduleContainer: {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 10,
    flex: 1.5,
    width: "100%",
    elevation: 3,
  },
  timeInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    elevation: 3,
  },
  flightScheduleTitle: {
    color: colors.dark1,
    fontSize: 12,
    fontWeight: "600",
    width: "50%",
    textAlign: "center",
  },
  flightScheduleTime: {
    color: colors.light1,
    fontSize: 14,
    fontWeight: "600",
    //width: "50%",
    textAlign: "left",
  },
  localAndForeignTimeContainer:{

  },
  flightScheduleLocalTime:{
    color: colors.light1,
    fontSize: 10,
    fontWeight: "400",
    //width: "50%",
    textAlign: "left",
  },
  weatherCardContainer:{
    flex:3,
  }
});


