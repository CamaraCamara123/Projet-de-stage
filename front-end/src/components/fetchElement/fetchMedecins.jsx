import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const fetchMedecins = async (path,updateMedecins) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.get(`${path}/api/users/dermatologue/all`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        updateMedecins(response.data);
        console.log(response.data)
    } catch (error) {
        console.error('Erreur lors de la récupération des données medecins :', error);
    }
};

export const fetchMedecin = async (path,user_id,updateMedecin) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/users/user/${user_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateMedecin(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du medecin :', error);
    }
  };

  export const fetchMedecinPatient = async (path,user_id,updatePatients) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

