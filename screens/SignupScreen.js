import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Crypto from "expo-crypto";
import { colors } from "../assets/colors";
import { backendURL } from "../assets/URLs";
import { login } from "../reducers/user"

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const timeoutRef = useRef(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  if (user.email != null) {
    navigation.navigate("Mon Compte");
  }

  const errorMsgTimeOut = () => {
    timeoutRef.current = setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  const handleSubmit = async () => {
    console.log('<------signout------>')
    if (
      firstname === "" ||
      lastname === "" ||
      email === "" ||
      password === "" ||
      checkPassword === ""
    ) {
      setErrorMessage("Tous les champs doivent être renseignés");
      errorMsgTimeOut();
      return;
    }

    if (
      !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setErrorMessage("L'adresse mail est invalide");
      errorMsgTimeOut();
      return;
    }

    if (
      !String(password)
        .toLowerCase()
        .match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    ) {
      setErrorMessage(
        "Le mot de passe doit contenir au moins 8 caractères dont une lettre, un numéro et un caractère spécial"
      );
      errorMsgTimeOut();
      return;
    }

    if (password !== checkPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      errorMsgTimeOut();
      return;
    }

    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    fetch(`${backendURL}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login(data.userData));
          setErrorMessage("");
          setEmail("");
          setPassword("");
          setFirstname("");
          setLastname("");
          navigation.navigate("Recherche");
        } else if (data.result === false) {
          setErrorMessage(data.error);
          errorMsgTimeOut();
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "height" : "padding"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.emailConnectContainer}>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Prénom</Text>
              <TextInput
                cursorColor={colors.light1}
                allowFontScaling={true}
                style={styles.inputs}
                onChangeText={(value) => setFirstname(value)}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Nom de famille</Text>
              <TextInput
                cursorColor={colors.light1}
                allowFontScaling={true}
                style={styles.inputs}
                onChangeText={(value) => setLastname(value)}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Email</Text>
              <TextInput
                cursorColor={colors.light1}
                allowFontScaling={true}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputs}
                onChangeText={(value) => setEmail(value)}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Mot de passe</Text>
              <TextInput
                cursorColor={colors.light1}
                autoCapitalize="none"
                allowFontScaling={true}
                secureTextEntry={true}
                textContentType={"password"}
                style={styles.inputs}
                onChangeText={(value) => setPassword(value)}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldSet}>
              <Text style={styles.legend}>Confirmez le mot de passe</Text>
              <TextInput
                cursorColor={colors.light1}
                autoCapitalize="none"
                allowFontScaling={true}
                secureTextEntry={true}
                textContentType={"password"}
                style={styles.inputs}
                onChangeText={(value) => setCheckPassword(value)}
              />
            </View>
          </View>
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {handleSubmit(); }}
          >
            <Text style={styles.loginBtnTxt}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createAccount}
            onPress={() => navigation.navigate("Connexion")}
          >
            <Text style={styles.createAccountTxt}>J'ai déjà un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emailConnectContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessageContainer: {
    width: "80%",
    marginBottom: 2,
    marginTop: 0,
  },
  errorMessage: {
    color: "red",
    alignSelf: "flex-end",
    fontSize: 11,
  },
  fieldContainer: {
    width: "80%",
    marginBottom: 20,
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
  loginBtn: {
    width: "80%",
    backgroundColor: colors.dark1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  loginBtnTxt: {
    alignSelf: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  createAccount: {
    marginTop: 15,
  },
  createAccountTxt: {
    textDecorationLine: "underline",
    color: colors.dark1,
  },
});
