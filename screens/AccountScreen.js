import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";

import { colors } from "../assets/colors";
import {backendURL} from '../assets/URLs'

import * as Crypto from "expo-crypto";

import { useDispatch, useSelector } from "react-redux";
import { updateEmail, logout } from "../reducers/user";

export default function AccountScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [errorMessageMail, setErrorMessageMail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [successMessageMail, setSuccessMessageMail] = useState("");
  const [successMessagePassword, setSuccessMessagePassword] = useState("");

  const user = useSelector((state) => state.user.value);
  console.log(user)
	if (user.email === null){
		navigation.navigate('Connexion')
}
	const dispatch = useDispatch();

	console.log(user.email)

  const handleChangeEmail = () => {
    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setErrorMessageMail("L'adresse mail est invalide");
      return;
    }

		fetch(`${backendURL}/user/profile-update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldEmail: user.email,
				newEmail:email,
        token:user.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data.result);
					dispatch(updateEmail(email));
          setErrorMessageMail("");
          setSuccessMessageMail(data.message);
        } else if (data.result === false) {
          setSuccessMessageMail("");
          setErrorMessageMail(data.error);
        }
      });
  };

  const handleChangePassword = async () => {
    if (newPassword != newPasswordCheck) {
      setSuccessMessagePassword("");
      setErrorMessagePassword("Les mots de passe ne correspondent pas");
      return;
    }

    if (
      !String(newPassword)
        .toLowerCase()
        .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    ) {
      console.log("ok");
      setSuccessMessagePassword("");
      setErrorMessagePassword(
        "Le mot de passe doit contenir au moins 8 caractères dont une lettre, un numéro et un caractère spécial"
      );
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

    console.log(hashedOldPassword, hashedNewPassword, user.email);

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
          console.log(data.result);
          setErrorMessagePassword("");
          setSuccessMessagePassword(data.message);
          setOldPassword("");
          setNewPassword("");
          setNewPasswordCheck("");
        } else if (data.result === false) {
          setSuccessMessagePassword("");
          setErrorMessagePassword(data.error);
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
		navigation.navigate("Recherche")
	}

	const handleLogoutAccount = () => {
		dispatch(logout());
		navigation.navigate("Recherche")
	}

  return (
    <KeyboardAvoidingView style={styles.container}>
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
              allowFontScaling={true}
              keyboardType="email-address"
              style={styles.inputs}
              onChangeText={(value) => setEmail(value)}
            ></TextInput>
          </View>
        </View>
        {errorMessageMail ? <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{errorMessageMail}</Text>
        </View> : null}
        {successMessageMail ? <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{successMessageMail}</Text>
        </View> : null}
        <TouchableOpacity
          style={styles.validButton}
          onPress={() => handleChangeEmail()}
        >
          <Text style={styles.validButtonText}>Valider les modifications</Text>
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
              cursorColor={colors.light1}
              allowFontScaling={true}
              style={styles.inputs}
              onChangeText={(value) => setNewPassword(value)}
            ></TextInput>
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <View style={styles.fieldSet}>
            <Text style={styles.legend}>Confirmez le nouveau mot de passe</Text>
            <TextInput
              textContentType={"password"}
              secureTextEntry={true}
              cursorColor={colors.light1}
              allowFontScaling={true}
              style={styles.inputs}
              onChangeText={(value) => setNewPasswordCheck(value)}
            ></TextInput>
          </View>
        </View>
        {errorMessagePassword ? <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{errorMessagePassword}</Text>
        </View> : null}
        {successMessagePassword ? <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{successMessagePassword}</Text>
        </View> : null}
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
					onPress={() => handleLogoutAccount()}
				>
					<Text style={styles.deleteAccountTxt}>Se déconnecter</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.deleteAccount}
					onPress={() => handleDeleteAccount()}
				>
					<Text style={styles.deleteAccountTxt}>Supprimer mon compte</Text>
				</TouchableOpacity>
			</View>
			
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGrey,
    overflow: "scroll",
  },
  userDataContainer: {
    width: "100%",
    alignItems: "center",
		marginTop:20,
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
    backgroundColor: colors.dark1,
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
	optionsContainer:{
		width:'100%',
		flexDirection:'row',
		justifyContent:'space-evenly'
	},
  deleteAccount: {
    marginTop: 20,
    marginBottom: 20,
  },
  deleteAccountTxt: {
    textDecorationLine: "underline",
    color: colors.dark1,
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
