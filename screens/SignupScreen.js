import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react'

import { colors } from '../assets/colors'

import * as Crypto from 'expo-crypto';

export default function SignupScreen({navigation}) {

    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [checkPassword, setCheckPassword]=useState('')
    const [firstname, setFirstname]=useState('')
    const [lastname, setLastname]=useState('')
    const [errorMessage, setErrorMessage]=useState('')

    const handleSubmit = async () => {

        if(password!=checkPassword){
            setErrorMessage('Les mots de passe ne correspondent pas')
            return;
        }

        if(!String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            setErrorMessage("L'adresse mail est invalide")
            return;
        }

        if(!String(password).toLowerCase().match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)){
            setErrorMessage('Le mot de passe doit contenir au moins 8 caractères dont une lettre, un numéro et un caractère spécial')
            return;
        }

        const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256, password
        )
        console.log(hashedPassword)
        fetch('http://localhost:3000/user/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email, password: hashedPassword, firstname:firstname, lastname:lastname }),
		}).then(response => response.json())
        .then(data => {
            if (data.result) {
                setErrorMessage('')
                setEmail('');
                setPassword('');
                setFirstname('');
                setLastname('');
            }else if (data.result===false){
                setErrorMessage(data.error)
            }
        });
    }

    return (
        <View style={styles.container}>

            <View style={styles.emailConnectContainer}>
                <View style={styles.dropShadow}>
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Prénom</Text>
                        <TextInput style={styles.inputs} onChangeText={(value)=>setFirstname(value)}></TextInput>
                    </View>
                </View>
                <View style={styles.dropShadow}>
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Nom de famille</Text>
                        <TextInput style={styles.inputs} onChangeText={(value)=>setLastname(value)}></TextInput>
                    </View>
                </View>
                <View style={styles.dropShadow}>
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Email</Text>
                        <TextInput style={styles.inputs} onChangeText={(value)=>setEmail(value)}></TextInput>
                    </View>
                </View>
                <View style={styles.dropShadow}>
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Mot de passe</Text>
                        <TextInput style={styles.inputs} onChangeText={(value)=>setPassword(value)}></TextInput>
                    </View>
                </View>
                <View style={styles.dropShadow}>
                    <View style={styles.fieldSet}>
                        <Text style={styles.legend}>Confirmez le mot de passe</Text>
                        <TextInput type='password' style={styles.inputs} onChangeText={(value)=>setCheckPassword(value)}></TextInput>
                    </View>
                </View>
                <View style={styles.errorMessageContainer}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
                <TouchableOpacity style={styles.loginBtn} onPress={()=>handleSubmit()}>
                    <Text style={styles.loginBtnTxt}>Connexion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createAccount} onPress={()=>navigation.navigate('Signin')}>
                    <Text style={styles.createAccountTxt}>J'ai déjà un compte</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.lightGrey,
        marginTop:-30,
    },
    emailConnectContainer:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    errorMessageContainer:{
        width:'80%',
        marginBottom:2,
        marginTop:15,
    },
    errorMessage:{
        color:'red',
        alignSelf:'flex-end',
        fontSize:11
    },
    dropShadow:{
        width:'80%',
        shadowOffset: { width: 5, height: 9 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 4.84,
        elevation:8,
        marginBottom:20,
        borderRadius: 5,
    },
    fieldSet:{
        width:'100%',
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5,
        borderWidth: 2,
        alignItems: 'center',
        borderColor: '#000',
        backgroundColor : colors.lightGrey,
        elevation:4,
        
    },
    legend:{
        position: 'absolute',
        top: -10,
        left: 10,
        fontWeight: '600',
        paddingHorizontal:3,
        fontSize:11,
        backgroundColor: colors.lightGrey
    },
    inputs:{
        width:'100%',
        justifyContent:'center',
        height:40,
    },
    loginBtn:{
        width:'80%',
        backgroundColor:colors.dark1,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        height:50,
    },
    loginBtnTxt:{
        alignSelf:'center',
        color:'white',
        fontWeight:'600',
        fontSize:15,
    },
    createAccount:{
        marginTop:15
    },
    createAccountTxt:{
        textDecorationLine:'underline',
        color:colors.dark1
    }
});