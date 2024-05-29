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

  const [isFavorited, setIsFavorited] = useState(false);
  const [flightData, setFlightData]=useState({})
  const dispatch = useDispatch();

  useEffect(  () => {
    async function fetchFlightData(flightDataTracking) {
    try {
      const response = await fetch(`${backendURL}/flights/${flightDataTracking.flightNumber}/${flightDataTracking.date}`);
      const data = await response.json();
      console.log('response------>', data);
      
      if (data.result) {
        setFlightData(data.flightData);
        console.log('data---->', flightData);

        const isFavorite = favoriteFlights.some(favorite => favorite.flightNumber === data.flightData.flightNumber);
        setIsFavorited(isFavorite);
        console.log(isFavorited)

        const lastUpdate = moment(data.flightData.lastUpdatedUTC)
        const departureTime = moment(data.flightData.departure.revisedTimeUTC)
        const arrivalTime = moment(data.flightData.arrival.revisedTimeUTC)
  
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

      } else if (data.result === false) {
        alert("Une erreur s'est produite, merci de ré-essayer");
        navigation.navigate('Recherche');
      }
    } catch (error) {
      console.error("Une erreur s'est produite:", error);
      alert("Une erreur s'est produite, merci de ré-essayer");
      navigation.navigate('Recherche');
    }
    
    }

    fetchFlightData(flightDataTracking);
  }, []);

  var {
    status,
    departure,
    arrival,
    distance,
  } = flightData;

  console.log('ddkjbsbds', status)



  const handleFavoriteClick = () => {
    if(user.token){

      if (!isFavorited) {
        fetch(`${backendURL}/user/favorite`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flightData: flightData, email: user.email, token: user.token }),
        })
        .then((response) => response.json())
        .then(data => {
          console.log('data de la BDD---->',flightData)
          dispatch(addFavorite(flightData))
        }
          
          )
  
      } else {
        fetch(`${backendURL}/user/favorite`,{
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flightNumber: flightData.flightNumber, email: user.email, token: user.token }),
        })
        .then((response) => response.json())
        .then(()=>{
          dispatch(removeFavorite(flightData.flightNumber))
        })
      }

    }else{
      if (!isFavorited) {
        dispatch(addFavorite(flightData))
      } else {
        dispatch(removeFavorite(flightData.flightNumber))
      }
    }
  };

  let iconStyle = { color: 'grey', marginLeft: 10 };
  if (isFavorited) {
    iconStyle = { color: 'red', marginLeft: 10 };
  } 

 
  return (
    <View style={styles.container}>
        {flightData.status ? <View style={styles.flightDataContainer}>
        <View style={styles.flightDescription}>
        <View style={styles.flightHeader}>
          <View style={styles.leftSpace}></View>
          <View>
            <Text style={styles.flightNumber}>{flightData.flightNumber}</Text>
            <Text style={styles.airline}>{flightData.airline}</Text>
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
                style={iconStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
          <Text style={styles.flightStatusTitle}>{status === 'Unknown' ? 'En attente de départ' : status.toUpperCase()}</Text>
          <Text style={styles.flightLengthDescription}>{`${Math.round(Number(distance))} km en ${totalFlightHours}h${totalFlightMinutes} min`}</Text>
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
              <Text style={styles.city}>{departure.city.length>8 ? `${departure.city.slice(0,7)}...` : departure.city}</Text>
              <Text style={styles.aeroport}>{departure.iata}</Text>
              <Text style={styles.timezone}>{`UTC${departure.scheduledTimeLocal.slice(-6)}`}</Text>
            </View>
            <View style={styles.flightTicketsImgContainer}>
              <Image
                source={require("../assets/flight-tickets.png")}
                style={styles.flightTicketsImg}
              />
            </View>
            <View style={styles.cityContainer}>
              <Text style={styles.city}>{arrival.city.length>8 ? `${arrival.city.slice(0,7)}...` : arrival.city}</Text>
              <Text style={styles.aeroport}>{arrival.iata}</Text>
              <Text style={styles.timezone}>{`UTC${arrival.scheduledTimeLocal.slice(-6)}`}</Text>
            </View>
          </View>
          <View style={styles.flightScheduleContainer}>
            <View style={styles.timeInfoContainer}>
              <Text style={styles.flightScheduleTitle}>Prévu</Text>
              <Text style={styles.flightScheduleTime}>{departure.scheduledTimeLocal ? `${departure.scheduledTimeLocal.slice(11,16)}` : '-'}</Text>
            </View>
            <View style={styles.timeInfoContainer}>
              <Text style={styles.flightScheduleTitle}>Prévu</Text>
              <View style={styles.localAndForeignTimeContainer}>
                <Text style={styles.flightScheduleTime}>{arrival.scheduledTimeLocal ? `${arrival.scheduledTimeLocal.slice(11,16)}` : '-'}</Text>
                <Text style={styles.flightScheduleLocalTime}>{arrival.scheduledTimeLocal ? `${moment(arrival.scheduledTimelocal).toISOString().slice(11,16)} (${arrival.countryCode})` : '-'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.flightScheduleContainer}>
            <View style={styles.timeInfoContainer}>
              <Text style={styles.flightScheduleTitle}>Réel</Text>
              <Text style={styles.flightScheduleTime}>{departure.revisedTimeLocal ? `${departure.revisedTimeLocal.slice(11,16)}` : '-'}</Text>
            </View>
            <View style={styles.timeInfoContainer}>
              <Text style={styles.flightScheduleTitle}>Estimé</Text>
              <View style={styles.localAndForeignTimeContainer}>
                <Text style={styles.flightScheduleTime}>{arrival.revisedTimeLocal ? `${arrival.revisedTimeLocal.slice(11,16)}` : '-'}</Text>
                <Text style={styles.flightScheduleLocalTime}>{arrival.revisedTimeLocal ? `${moment(arrival.revisedTimeLocal).toISOString().slice(11,16)} (${arrival.countryCode})` : '-'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View> : null}
      
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
  flightDataContainer:{
    flex: 15, 
    width:'100%',
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
    fontSize: 18,
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
    fontSize: 20,
    fontWeight: "800",
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


  // let flightData = {
  //   "flightNumber": "TB 1432",
  //   "date": "2024-05-29",
  //   "airline": "TUI  Belgium",
  //   "status": "Departed",
  //   "lastUpdateUTC": "2024-05-29 07:42Z",
  //   "distance": 1250.02,
  //   "departure": {
  //     "iata": "PMI",
  //     "city": "Palma De Mallorca",
  //     "terminal": "N",
  //     "countryCode": "ES",
  //     "scheduledTimeUTC": "2024-05-29 07:05Z",
  //     "scheduledTimeLocal": "2024-05-29 09:05+02:00",
  //     "revisedTimeUTC": "2024-05-29 07:04Z",
  //     "revisedTimeLocal": "2024-05-29 09:04+02:00"
  //   },
  //   "arrival": {
  //     "iata": "LGG",
  //     "city": "Liège",
  //     "countryCode": "BE",
  //     "scheduledTimeUTC": "2024-05-29 09:45Z",
  //     "scheduledTimeLocal": "2024-05-29 11:45+02:00"
  //   }
  // }
