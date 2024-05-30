import { View, Text, StyleSheet } from "react-native";
import CustomSwitch from "../components/CustomSwitch";
import { colors } from "../assets/colors";
import { backendURL } from "../assets/URLs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTimeFormat,
  updateDistanceUnit,
  updateTemperatureUnit,
  updateNotifications,
  resetSettingsReducer,
} from "../reducers/settings";

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings.value);
  const user = useSelector((state) => state.user.value);


  useEffect(() => {
    const fetchSettings = async () => {
      if (user.token !== null) {
        try {
          const response = await fetch(`${backendURL}/user/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              token: user.token,
            }),
          });
          const data = await response.json();
          if (data.result) {
            dispatch(updateTimeFormat(data.userData.timeFormat));
            dispatch(updateDistanceUnit(data.userData.distUnit));
            dispatch(updateTemperatureUnit(data.userData.tempUnit));
            dispatch(updateNotifications(data.userData.globalNotification));
          }
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      } else {
        dispatch(resetSettingsReducer());
      }
    };

    navigation.addListener("focus", fetchSettings);

    return () => {
      navigation.removeListener("focus", fetchSettings);
    };
  }, [dispatch, user, navigation]);

  const updateSettings = async (updatedSettings) => {
    if (user.token !== null) {
      try {
        const response = await fetch(`${backendURL}/user/settings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: user.token,
            ...updatedSettings,
          }),
        });
        const data = await response.json();
      } catch (error) {
        console.error("Error updating settings:", error);
      }
    } else {
    }
  };

  const handleTimeFormatSwitch = (newFormat) => {
    dispatch(updateTimeFormat(newFormat));
    updateSettings({ timeFormat: newFormat });
  };

  const handleDistanceUnitSwitch = (newUnit) => {
    dispatch(updateDistanceUnit(newUnit));
    updateSettings({ distUnit: newUnit });
  };

  const handleTemperatureUnitSwitch = (newUnit) => {
    dispatch(updateTemperatureUnit(newUnit));
    updateSettings({ tempUnit: newUnit });
  };

  const handleNotificationsSwitch = (newStatus) => {
    dispatch(updateNotifications(newStatus));
    updateSettings({ globalNotification: newStatus });
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <View style={styles.settingRowContainer}>
          <Text style={styles.settingName}>Format de l'heure :</Text>
          <CustomSwitch
            style={styles.toggleSwitch}
            selectionMode={settings.timeFormat === "24h" ? 1 : 2}
            roundCorner={true}
            option1={"24h"}
            option2={"12h"}
            onSelectSwitch={handleTimeFormatSwitch}
            selectionColor={colors.dark2}
          />
        </View>
        <View style={styles.settingRowContainer}>
          <Text style={styles.settingName}>Distances en :</Text>
          <CustomSwitch
            style={styles.toggleSwitch}
            selectionMode={settings.distanceUnit === "km" ? 1 : 2}
            roundCorner={true}
            option1={"km"}
            option2={"miles"}
            onSelectSwitch={handleDistanceUnitSwitch}
            selectionColor={colors.dark2}
          />
        </View>
        <View style={styles.settingRowContainer}>
          <Text style={styles.settingName}>Températures en :</Text>
          <CustomSwitch
            style={styles.toggleSwitch}
            selectionMode={settings.temperatureUnit === "°C" ? 1 : 2}
            roundCorner={true}
            option1={"°C"}
            option2={"°F"}
            onSelectSwitch={handleTemperatureUnitSwitch}
            selectionColor={colors.dark2}
          />
        </View>
        <View style={styles.settingRowContainer}>
          <Text style={styles.settingName}>Notifications :</Text>
          <CustomSwitch
            style={styles.toggleSwitch}
            selectionMode={settings.notifications === "on" ? 1 : 2}
            roundCorner={true}
            option1={"on"}
            option2={"off"}
            onSelectSwitch={handleNotificationsSwitch}
            selectionColor={colors.dark2}
          />
        </View>
      </View>
      <Text style={styles.credits}>
        Application codée avec ♥ par JuanMoreLine et Medkar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 20,
    marginTop: 40,
    paddingBottom: 20,
  },
  settingContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    alignItems: "baseline",
    marginBottom: 30,
  },
  settingRowContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  settingName: {
    paddingRight: 10,
    width: "50%",
    color: colors.dark1,
    fontSize: 17,
    fontWeight: "600",
  },
  credits: {
    fontSize: 10,
    color: colors.dark1,
  },
});
