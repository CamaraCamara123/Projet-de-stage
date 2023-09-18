import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from '../components';
import { useUserData } from '../contexts/useUserData';
import { View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useAuth } from '../contexts/useAuth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('screen');

const Home = () => {
  const { consultations } = useUserData()
  const [searchValue, setSearchValue] = useState('');

  const filteredConsultations = consultations.filter((consultation) => {
    return (
      consultation.rdv.patient.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
      consultation.rdv.dateDebutRdv.toLowerCase().includes(searchValue.toLowerCase()) ||
      consultation.rdv.patient.tel.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
  const renderConsultations = () => {
    return (
      <Block flex center style={styles.home}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or Number"
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
          contentContainerStyle={styles.consultations}>
          <Block flex>
            {consultations &&
              filteredConsultations.map((consult, index) => (
                <Block key={index}>
                  <Card item={consult} horizontal />
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
  consultations: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  searchContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray', // Couleur de fond du champ de recherche
    borderRadius: 15,

  },
  header: {
    backgroundColor: 'white',
    padding: 10,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
});

export default Home;
