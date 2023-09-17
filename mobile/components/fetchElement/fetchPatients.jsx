import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const fetchMedecinPatient = async (path,user_id,updatePatients) => {
  try {
    const response = await axios.get(`${path}/api/medecin/patients/${user_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updatePatients(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données des patient du medecin :', error);
  }
};