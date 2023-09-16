import React, { useState } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUserData } from '../contexts/useUserData';
import { View, Text } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { fetchConsultation } from '../components/fetchElement/fetchConsultation';
import CardDiagnostic from '../components/CardDiagnostic';



const { width } = Dimensions.get('screen');

const Diagnostics = ({ navigation }) => {
    const { diagnostics, consultation, updateConsultation, path } = useUserData()
    const [searchValue, setSearchValue] = useState('');

    const filtereddiagnostics = diagnostics.filter((diagnos) => {
        return (
            diagnos.dateDiagnostic.toLowerCase().includes(searchValue.toLowerCase()) ||
            diagnos.maladie.nom.toLowerCase().includes(searchValue.toLowerCase())
        );
    });

    const newdiagnos = () => {
        fetchConsultation(path,consultation._id, updateConsultation);
        navigation.navigate("New_Diagnostic")
    }
    const renderdiagnostics = () => {
        return (
            <Block flex center style={styles.home}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Diagnostics</Text>
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
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.diagnostics}>
                    <Block flex>
                        {diagnostics &&
                            filtereddiagnostics.map((diagnos, index) => (
                                <Block key={index}>
                                    <CardDiagnostic item={diagnos} horizontal />
                                </Block>
                            ))}
                    </Block>
                </ScrollView>
                <View style={styles.addContainer}>
                        <TouchableOpacity onPress={newdiagnos}>
                            <Icon
                                name="plus"
                                size={40}
                                style={styles.addIcon}
                                color="green"
                            />
                        </TouchableOpacity>
                    </View>
            </Block>
        )
    }

    return (
        <Block flex center style={styles.home}>
            {renderdiagnostics()}
        </Block>
    );
}

const styles = StyleSheet.create({
    home: {
        width: width,
    },
    diagnostics: {
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
        maxHeight: 150,
        paddingTop: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 10,
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

export default Diagnostics;
