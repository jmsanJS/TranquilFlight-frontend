import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect, useRef } from "react";

import { colors } from "../assets/colors";
import { backendURL } from "../assets/URLs";

import * as Crypto from "expo-crypto";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";

export default function SigninScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  // if (user.email != null) {
  //   navigation.navigate("Mon Compte");
  // }

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const timeoutRef = useRef(null);

  const handleFocus = (key) => {
    setIsFocused((prevState) => ({ ...prevState, [key]: true }));
  };

  const handleBlur = (key) => {
    setIsFocused((prevState) => ({ ...prevState, [key]: false }));
  };

  const handleSubmit = async () => {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    fetch(`${backendURL}/user/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: hashedPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setEmail("");
          setPassword("");
          dispatch(login(data.userData));
          navigation.navigate("Home");
        } else if (data.result === false) {
          setErrorMessage(data.error);
          timeoutRef.current = setTimeout(() => {
            setErrorMessage("");
          }, 4000);      
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.emailConnectContainer}>
        {/* <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View> */}
        <View style={styles.dropShadow}>
          <View
            style={[styles.fieldSet, isFocused.email && styles.focusedInput]}
          >
            <Text style={styles.legend}>Email</Text>
            <TextInput
              cursorColor={colors.light1}
              allowFontScaling={true}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputs}
              onChangeText={(value) => setEmail(value)}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
            ></TextInput>
          </View>
        </View>
        <View style={styles.dropShadow}>
          <View
            style={[styles.fieldSet, isFocused.password && styles.focusedInput]}
          >
            <Text style={styles.legend}>Mot de passe</Text>
            <TextInput
              cursorColor={colors.light1}
              allowFontScaling={true}
              secureTextEntry={true}
              textContentType={"password"}
              autoCapitalize="none"
              style={styles.inputs}
              onChangeText={(value) => setPassword(value)}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
            ></TextInput>
          </View>
        </View>
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.loginBtnTxt}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createAccount}
          onPress={() => navigation.navigate("Créer un compte")}
        >
          <Text style={styles.createAccountTxt}>Créer un compte</Text>
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
    marginTop: -30,
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
    // marginTop: -15,
  },
  errorMessage: {
    color: "red",
    alignSelf: "flex-end",
    fontSize: 11,
  },
  dropShadow: {
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
    borderColor: "#000",
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
  focusedInput: {
    borderWidth: 3,
    borderRadius: 3,
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
