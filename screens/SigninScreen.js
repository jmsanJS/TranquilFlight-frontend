import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react'

import { colors } from '../assets/colors'

import * as Crypto from 'expo-crypto';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/user';

export default function SigninScreen({navigation}) {

    const user = useSelector((state) => state.user.value);

    const dispatch = useDispatch();

    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [errorMessage, setErrorMessage]=useState('')

    const handleSubmit = async () => {
        console.log('front')
        const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256, password
        )
        console.log(hashedPassword)
        fetch('http://localhost:3000/user/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: email, password: hashedPassword }),
		}).then(response => response.json())
        .then(data => {
            if (data.result) {
                setEmail('');
                setPassword('');
                dispatch(login(data.userData));
            }else if (data.result===false){
                setErrorMessage(data.error)
            }
        });
    }

    return (
        <View style={styles.container}>

            <View style={styles.ApisConnectContainer}>
                <TouchableOpacity style={styles.ApisConnectBtn}>
                    <Text style={styles.ApisConnectTxt}>Connexion Via Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ApisConnectBtn}>
                    <Text style={styles.ApisConnectTxt}>Connexion via Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ApisConnectBtn}>
                    <Text style={styles.ApisConnectTxt}>Connexion via Apple</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.separatorContainer}>
                <View style={styles.separator}></View>
                <Text style={styles.separatorTxt}>OU</Text>
                <View style={styles.separator}></View>
            </View>

            <View style={styles.emailConnectContainer}>
                <View style={styles.errorMessageContainer}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
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
                <TouchableOpacity style={styles.loginBtn} onPress={()=>handleSubmit()}>
                    <Text style={styles.loginBtnTxt}>Connexion</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createAccount} onPress={()=>navigation.navigate('Créer un compte')}>
                    <Text style={styles.createAccountTxt}>Créer un compte</Text>
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
    ApisConnectContainer:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    ApisConnectBtn:{
        width:'80%',
        backgroundColor:colors.dark1,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        height:50,
        marginBottom:20,
    },
    ApisConnectTxt:{
        alignSelf:'center',
        color:'white',
        fontWeight:'600',
        fontSize:15,
    },
    separatorContainer:{
        width:'80%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:-20,
    },
    separator:{
        borderColor:colors.dark1,
        borderBottomWidth:1,
        width:'40%',
    },
    separatorTxt:{
        color:colors.dark1,
        fontWeight:'600'
    },
    emailConnectContainer:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    errorMessageContainer:{
        width:'80%',
        marginBottom:2
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