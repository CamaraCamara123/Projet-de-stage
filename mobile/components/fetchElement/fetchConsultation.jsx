import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchConsultations = async (path, updateConsultations) => {
  const token = AsyncStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('')
  try {
    const response = await axios.get(`${path}/api/consultations`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateConsultations(response.data);
    // console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données consultations :', error);
  }
};

export const fetchConsultation = async (path, consult_id, updateConsultation) => {
  // const token = AsyncStorage.getItem('token');
  // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // console.log(token)
  try {
    const response = await axios.get(`${path}/api/consultation/${consult_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateConsultation(response.data);
    // console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données consultation 111 :', error);
  }
};

export const fetchConsultationsRdv = async (path, rdv_id, updateConsultation) => {
  try {
    
    const response = await axios.get(`${path}/api/rdv/consultation/${rdv_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateConsultation(response.data);
    // console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données consultations :', error);
  }
};

//visites du jour du medecin
export const fetchMedecinDayConsultations = async (path, medecin_id, updateConsultations) => {
  // const token = await AsyncStorage.getItem('token');
  // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('token')
  try {
    const response = await axios.get(`${path}/api/visite/dermatologue/today/${medecin_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateConsultations(response.data);
    // console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données consultations :', error);
  }
};

// les visites d'un medecin avec un patient données
export const fetchPatientMedecinVisite = async (path, medecin_id, patient_id, updateConsultations) => {
  const token = await AsyncStorage.getItem('token');
  console.log('')
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  try {
    const response = await axios.get(`${path}/api/visite/medecin/patient/${medecin_id}/${patient_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateConsultations(response.data);
    // console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des rdv d\'aujourd\'hui :', error);
  }
};

// les visites d'un patient donné
export const fetchPatientVisite = async (path, patient_id, updateConsultations) => {
  const token = await AsyncStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log(token)
  try {
    const response = await axios.get(`${path}/api/visite/patient/${patient_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateConsultations(response.data);
    // console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des visites :', error);
  }
};




