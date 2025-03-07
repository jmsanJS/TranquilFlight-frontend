import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect, useRef } from "react";

import { colors } from "../assets/colors";
import { backendURL } from "../assets/URLs";

import * as Crypto from "expo-crypto";

import { useDispatch, useSelector } from "react-redux";
import { updateEmail, logout } from "../reducers/user";
import { emptyReducer } from "../reducers/favoriteFlights";

export default function AccountScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [errorMessageMail, setErrorMessageMail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [successMessageMail, setSuccessMessageMail] = useState("");
  const [successMessagePassword, setSuccessMessagePassword] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const timeoutRef = useRef(null);

  // if (user.email === null) {
  //   navigation.navigate("Connexion");
  // }

  const messageTimeOut = () => {
    timeoutRef.current = setTimeout(() => {
      setErrorMessageMail("");
      setErrorMessagePassword("");
      setSuccessMessageMail("");
      setSuccessMessagePassword("");
    }, 4000);
  };

  const validateAndAlert = () => {
    if (email === user.email || email === "") {
      setErrorMessageMail("Saisissez votre nouvelle adresse mail");
      messageTimeOut();
      return;
    } else if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setErrorMessageMail("L'adresse mail est invalide");
      messageTimeOut();
      return;
    }

    modifyEmailAlert();
  };

  const handleChangeEmail = () => {
    fetch(`${backendURL}/user/profile-update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldEmail: user.email,
        newEmail: email,
        token: user.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updateEmail(email));
          setErrorMessageMail("");
          setSuccessMessageMail(data.message);
          messageTimeOut();
        } else if (data.result === false) {
          setErrorMessageMail(data.error);
          messageTimeOut();
        }
      });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChangePassword = async () => {
    if (newPassword != newPasswordCheck) {
      setSuccessMessagePassword("");
      setErrorMessagePassword("Les mots de passe ne correspondent pas");
      messageTimeOut();
      return;
    }

    if (
      !String(newPassword)
        .toLowerCase()
        .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    ) {
      setSuccessMessagePassword("");
      setErrorMessagePassword(
        "Le mot de passe doit contenir au moins 8 caractères dont une lettre, un numéro et un caractère spécial"
      );
      messageTimeOut();
      return;
    }

    const hashedNewPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      newPassword
    );

    const hashedOldPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      oldPassword
    );

    fetch(`${backendURL}/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        password: hashedOldPassword,
        newPassword: hashedNewPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setErrorMessagePassword("");
          setSuccessMessagePassword(data.message);
          setOldPassword("");
          setNewPassword("");
          setNewPasswordCheck("");
          messageTimeOut();
        } else if (data.result === false) {
          setSuccessMessagePassword("");
          setErrorMessagePassword(data.error);
          messageTimeOut();
        }
      });
  };

  const handleDeleteAccount = () => {
    fetch(`${backendURL}/user`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        token: user.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(logout());
        }
      });
    navigation.navigate("Home");
  };

  const handleLogoutAccount = () => {
    dispatch(logout());
    dispatch(emptyReducer());
    setTimeout(function () {
      navigation.navigate("Home");
    }, 200);
  };

  const deleteAcountAlert = () =>
    Alert.alert(
      "Suppression de compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Non",
          style: "cancel",
        },
        { text: "Oui", onPress: () => handleDeleteAccount() },
      ]
    );

  const modifyEmailAlert = () =>
    Alert.alert(
      "Modification d'email",
      "Êtes-vous sûr de vouloir modifier l'email de votre compte?",
      [
        {
          text: "Non",
          style: "cancel",
        },
        { text: "Oui", onPress: () => handleChangeEmail() },
      ]
    );

  const signOutAlert = () =>
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Non",
        style: "cancel",
      },
      { text: "Oui", onPress: () => handleLogoutAccount() },
    ]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "height" : "padding"}
      keyboardVerticalOffset={85}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.userDataContainer}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Prénom</Text>
              <TextInput
                cursorColor={colors.light1}
                editable={false}
                allowFontScaling={true}
                style={styles.inputsLocked}
                placeholder={user.firstname}
              ></TextInput>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Nom de famille</Text>
              <TextInput
                cursorColor={colors.light1}
                editable={false}
                allowFontScaling={true}
                style={styles.inputsLocked}
                placeholder={user.lastname}
              ></TextInput>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Email</Text>
              <TextInput
                placeholder={user.email}
                cursorColor={colors.light1}
                autoCapitalize="none"
                allowFontScaling={true}
                keyboardType="email-address"
                style={styles.inputs}
                onChangeText={(value) => setEmail(value)}
              ></TextInput>
            </View>
          </View>
          {errorMessageMail ? (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessage}>{errorMessageMail}</Text>
            </View>
          ) : null}
          {successMessageMail ? (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessage}>{successMessageMail}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.validButton}
            onPress={() => validateAndAlert()}
          >
            <Text style={styles.validButtonText}>Modifier l'email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userNewPasswordContainer}>
          <Text style={styles.sectionTitle}>
            Réinitialisation du mot de passe
          </Text>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Ancien mot de passe</Text>
              <TextInput
                textContentType={"password"}
                secureTextEntry={true}
                autoCapitalize="none"
                cursorColor={colors.light1}
                allowFontScaling={true}
                style={styles.inputs}
                onChangeText={(value) => setOldPassword(value)}
              ></TextInput>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Nouveau mot de passe</Text>
              <TextInput
                textContentType={"password"}
                secureTextEntry={true}
                autoCapitalize="none"
                cursorColor={colors.light1}
                allowFontScaling={true}
                style={styles.inputs}
                onChangeText={(value) => setNewPassword(value)}
              ></TextInput>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>
                Confirmez le nouveau mot de passe
              </Text>
              <TextInput
                textContentType={"password"}
                secureTextEntry={true}
                autoCapitalize="none"
                cursorColor={colors.light1}
                allowFontScaling={true}
                style={styles.inputs}
                onChangeText={(value) => setNewPasswordCheck(value)}
              ></TextInput>
            </View>
          </View>
          {errorMessagePassword ? (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessage}>{errorMessagePassword}</Text>
            </View>
          ) : null}
          {successMessagePassword ? (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessage}>
                {successMessagePassword}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.validButton}
            onPress={() => handleChangePassword()}
          >
            <Text style={styles.validButtonText}>Modifier le mot de passe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.deleteAccount}
            onPress={() => signOutAlert()}
          >
            <Text style={styles.deleteAccountTxt}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteAccount}
            onPress={() => deleteAcountAlert()}
          >
            <Text style={styles.deleteAccountTxt}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 65,
  },
  userDataContainer: {
    width: "100%",
    alignItems: "center",
    // marginTop: 10,
  },
  userNewPasswordContainer: {
    width: "100%",
    alignItems: "center",
  },
  sectionTitle: {
    alignSelf: "center",
    textDecorationLine: "underline",
    color: colors.dark1,
    marginTop: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  fieldContainer: {
    width: "80%",
    marginBottom: 15,
    borderRadius: 5,
  },
  fieldSet: {
    width: "100%",
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    borderColor: colors.dark1,
    backgroundColor: colors.lightGrey,
  },
  legend: {
    position: "absolute",
    top: -10,
    left: 10,
    fontWeight: "600",
    paddingHorizontal: 3,
    fontSize: 11,
    backgroundColor: colors.lightGrey,
    color: colors.dark1,
  },
  inputs: {
    width: "100%",
    justifyContent: "center",
    height: 40,
    color: colors.light1,
  },
  inputsLocked: {
    width: "100%",
    justifyContent: "center",
    height: 40,
    color: "grey",
    backgroundColor: "#D7D7D7",
    borderRadius: 3,
  },
  validButton: {
    width: "80%",
    backgroundColor: colors.light1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  validButtonText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  optionsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  deleteAccount: {
    marginTop: 20,
    marginBottom: 20,
  },
  deleteAccountTxt: {
    textDecorationLine: "underline",
    color: colors.light1,
  },
  errorMessageContainer: {
    width: "80%",
    marginBottom: 2,
  },
  errorMessage: {
    color: "red",
    alignSelf: "flex-end",
    fontSize: 11,
  },
  successMessageContainer: {
    width: "80%",
    marginBottom: 2,
  },
  successMessage: {
    color: "green",
    alignSelf: "flex-end",
    fontSize: 11,
  },
});
