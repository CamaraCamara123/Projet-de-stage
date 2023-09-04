import React, { useState } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../components';
import { useUserData } from '../contexts/useUserData';
import { View, Text } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import CardConsult from '../components/CardConsult';
import { fetchRdv } from '../components/fetchElement/fetchRdvs';


const { width } = Dimensions.get('screen');

const Consultations = ({ navigation }) => {
    const { consultations, rdv, updateRdv } = useUserData()
    const [searchValue, setSearchValue] = useState('');

    const filteredConsultations = consultations.filter((consult) => {
        return (
            consult.rdv.patient.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
            consult.dateConsult.toLowerCase().includes(searchValue.toLowerCase())
        );
    });

    const newConsult = () => {
        fetchRdv(rdv._id, updateRdv);
        navigation.navigate("New_consultation")
    }
    const renderConsultations = () => {
        return (
            <Block flex center style={styles.home}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>CONSULTATIONS</Text>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or appointment date"
                            value={searchValue}
                            onChangeText={(text) => setSearchValue(text)}
                        />
                        <Icon
                            name="search"
                            size={20}
                            style={styles.searchIcon}
                        />
                    </View>
                    <View style={styles.addContainer}>
                        <TouchableOpacity onPress={newConsult}>
                            <Icon
                                name="plus"
                                size={40}
                                style={styles.addIcon}
                                color="green"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.Consultations}>
                    <Block flex>
                        {consultations &&
                            filteredConsultations.map((consult, index) => (
                                <Block key={index}>
                                    <CardConsult item={consult} horizontal />
                                </Block>
                            ))}
                    </Block>
                </ScrollView>
            </Block>
        )
    }

    return (
        <Block flex center style={styles.home}>
            {renderConsultations()}
        </Block>
    );
}

const styles = StyleSheet.create({
    home: {
        width: width,
    },
    Consultations: {
        width: width - theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE,
    },
    searchContainer: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 15,

    },
    header: {
        backgroundColor: 'khaki',
        padding: 10,
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        maxHeight: 200,
        paddingTop: 40,
        borderTopLeftRadius: 30, // Coin supérieur gauche
        borderTopRightRadius: 30, // Coin supérieur droit
        borderBottomRightRadius: 10, // Coin inférieur droit
        borderBottomLeftRadius: 10,


    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        width: 350,
        borderRadius: 15,
        backgroundColor: 'white'
    },
    searchIcon: {
        marginRight: 5,
        marginLeft: 5
    },
    addIcon: {
        alignSelf: 'flex-end',
    },
    addContainer: {
        alignItems: 'center'
    },
    titleContainer: {
        justifyContent: 'center',
        textAlign: 'center'
    },
    title: {
        fontSize: 40,
        alignSelf: 'center',
        fontWeight: '900',
        color: 'green'
    }
});

export default Consultations;
