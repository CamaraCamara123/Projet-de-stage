import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { useUserData } from '../contexts/useUserData';
import { DataTable } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Block, Text } from "galio-framework";
import { Card, Paragraph } from 'react-native-paper';
import { useAuth } from '../contexts/useAuth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Details_diagnostic = () => {

  const { diagnostic, consultation, details, path } = useUserData();
  const navigation = useNavigation();
  const { logout } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await axios.get(`${path}/api/consultation/diagnostics/${consultation._id}`);
        if (response.status == 201) {
          console.log('ici');
        }
      } catch (error) {
        logout();
        navigation.navigate("Login");
      }
    };
      fetchUserData();
     
  }, [consultation]);

  const ListItem = ({ item, index }) => (
    <View key={index} style={styles.listItem}>
      <Text style={styles.items}>{item}</Text>
    </View>
  );

  if (diagnostic) {
    return (
      <Block style={styles.maincontainer}>
        <View style={styles.hearder} center>
          <Text color="white" size={35} style={{ fontWeight: 'bolder' }}>
            {consultation.rdv.patient.nom}'s diagnostics
          </Text>
        </View>
        <ScrollView nestedScrollEnabled={true} contentContainerStyle={styles.container}>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title>Statistic table</DataTable.Title>
            </DataTable.Header>
            {diagnostic.maladies.map((data, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{data.fullName}</DataTable.Cell>
                <DataTable.Cell>{data.nom}</DataTable.Cell>
                <DataTable.Cell>{diagnostic.probabilities[index]} %</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          <View center style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <Paragraph style={{ alignSelf: 'center', color: 'black', fontSize: 20, fontWeight: '800' }}>Diagnostic Image </Paragraph>
              </Card.Content>
              <Card.Cover source={{ uri: `${path}/uploads/${diagnostic.imagePath}` }} />
            </Card>
            <Card style={styles.card}>
              <Card.Content>
                <Paragraph style={{ alignSelf: 'center', color: 'black', fontSize: 20, fontWeight: '800', marginBottom: 65 }}>DEGREE OF CERTAINTY</Paragraph>
                <Paragraph style={{ alignSelf: 'center', color: '#00008B', fontSize: 18, fontWeight: '800' }}>{diagnostic.maladie.nom} {'==>'} {diagnostic.probability} %</Paragraph>
              </Card.Content>
            </Card>
          </View>
          <View center style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <Paragraph style={{ alignSelf: 'center', color: 'black', fontSize: 20, fontWeight: '800', marginBottom: 20 }}>Requirements</Paragraph>
                <FlatList
                  data={diagnostic.prescription}
                  renderItem={({ item, index }) => <ListItem item={item} index={index} />}
                />
              </Card.Content>
            </Card>
            <Card style={styles.card}>
              <Card.Content>
                <Paragraph style={{ alignSelf: 'center', color: 'black', fontSize: 20, fontWeight: '800', marginBottom: 20 }}>Symptoms</Paragraph>

                <FlatList
                  data={diagnostic.descripSymptome}
                  keyExtractor={(item, index) => `key-${index}`}
                  renderItem={({ item, index }) => <ListItem item={item} index={index} />}
                />
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  container: {

    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  table: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginBottom: 10
  },
  evenRow: {
    backgroundColor: 'yellow',
  },
  oddRow: {
    backgroundColor: 'white',
  },
  cell: {
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  hearder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFFF',
    maxHeight: 150,
    minHeight: 150,
    borderRadius: 5,
    marginBottom:10
  },
  cardContainer: {
    flexDirection: 'row', // Met les cartes sur la même ligne
    justifyContent: 'space-between', // Les espaces entre les cartes
    marginHorizontal: 10, // Marge horizontale pour l'espacement
  },
  card: {
    flex: 1,
    margin: 10,
    elevation: 4,
    width: 150,
    backgroundColor: '#E1EBEE'
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  items: {
    alignSelf: 'center',
    color: '#00008B',
    fontSize: 10,
    fontWeight: '900'
  }
});

export default Details_diagnostic;
