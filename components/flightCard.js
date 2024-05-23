import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../assets/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite } from "../reducers/favoriteFlights";

function FlightCard(props) {
  const dispatch = useDispatch();

  const handleFavoriteClick = () => {
    dispatch(addFavorite());
  };
  return (
    <View style={styles.favoriteTripContainer}>
      <View style={styles.favoriteTripHeader}>
        <View style={styles.flightNumberContainer}>
          <Text style={styles.flightNumberText}>N0301</Text>
          <Text style={styles.companyText}>Air France</Text>
        </View>
        <Text style={styles.date}>19-06-2024</Text>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => handleFavoriteClick()}>
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
          <Text style={styles.departureTime}>14:56</Text>
          <Text style={styles.departureCity}>Paris</Text>
          <Text style={styles.departureAirportCode}>ORY</Text>
        </View>
        <View style={styles.routeLineContainer}>
          <Text style={styles.tripTime}>1h08</Text>
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
          <Text style={styles.arrivalTime}>16:04</Text>
          <Text style={styles.arrivalCity}>Lyon</Text>
          <Text style={styles.arrivalAirportCode}>LYS</Text>
        </View>
      </View>
    </View>
  );
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
