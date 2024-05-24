import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import CustomSwitch from '../components/CustomSwitch';

import {colors} from '../assets/colors'

export default function SettingsScreen() {

    const onSelectSwitch = index => {

    };

    return (
        <View style={styles.container}>
            <View style={styles.settingContainer}>
                <View style={styles.settingRowContainer}>
                    <Text style={styles.settingName}>Format de l'heure :</Text>
                    <CustomSwitch
                        style={styles.toggleSwitch}
                        selectionMode={1}
                        roundCorner={true}
                        option1={'24h'}
                        option2={'12h'}
                        onSelectSwitch={onSelectSwitch}
                        selectionColor={colors.dark2}
                    />
                </View>
                <View style={styles.settingRowContainer}>
                    <Text style={styles.settingName}>Distances en :</Text>
                    <CustomSwitch
                        style={styles.toggleSwitch}
                        selectionMode={1}
                        roundCorner={true}
                        option1={'km'}
                        option2={'miles'}
                        onSelectSwitch={onSelectSwitch}
                        selectionColor={colors.dark2}
                    />
                </View>
                <View style={styles.settingRowContainer}>
                    <Text style={styles.settingName}>Températures en :</Text>
                    <CustomSwitch
                        style={styles.toggleSwitch}
                        selectionMode={1}
                        roundCorner={true}
                        option1={'°C'}
                        option2={'°F'}
                        onSelectSwitch={onSelectSwitch}
                        selectionColor={colors.dark2}
                    />
                </View>
                <View style={styles.settingRowContainer}>
                    <Text style={styles.settingName}>Notifications :</Text>
                    <CustomSwitch
                        style={styles.toggleSwitch}
                        selectionMode={1}
                        roundCorner={true}
                        option1={'On'}
                        option2={'Off'}
                        onSelectSwitch={onSelectSwitch}
                        selectionColor={colors.dark2}
                    />
                </View>
            </View>
            <Text style={styles.credits}>Application codée avec ♥ par JuanMoreLine et Medkar</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        backgroundColor:colors.lightGrey,
        paddingHorizontal:20,
        marginTop:40,
        paddingBottom:20
    },
    settingContainer:{
        flex:1,
        flexDirection:'column',
        width:'100%',
        alignItems:'baseline',
        marginBottom:30
    },
    settingRowContainer:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:30
    },
    settingName:{
        paddingRight:10,
        width:'50%',
        color:colors.dark1,
        fontSize:17,
        fontWeight:'600',
    },
    credits:{
        fontSize:10,
    },
});