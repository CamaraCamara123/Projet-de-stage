import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const fetchMaladies = async (updateMaladies) => {
  const token =  await AsyncStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  try {
    const response = await axios.get('http://192.168.11.104:5000/api/maladies', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateMaladies(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données maladies :', error);
  }
};

export const fetchMaladie = async (maladie_id,updateMaladie) => {
  const token =  await AsyncStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  try {
    const response = await axios.get(`http://192.168.11.104:5000/api/maladie/${maladie_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateMaladie(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données maladie :', error);
  }
};