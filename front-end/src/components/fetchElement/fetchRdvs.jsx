import axios from "axios";

export const fetchRdvs = async (updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get('http://192.168.11.104:5000/api/rendez_vous', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateRdvs(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données rendez_vous :', error);
    }
  };

export const fetchMedecinRdvs = async (user_id,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/rendez_vous/dermatologue/${user_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateRdvs(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du rdv medecin :', error);
    }
  };

  export const fetchPatientRdvs = async (user_id,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/rendez_vous/patient/${user_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateRdvs(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du rdv patient :', error);
    }
  };

  export const fetchPatientMedecinRdvs = async (medecin_id, patient_id,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/rdv/medecin/patient/${medecin_id}/${patient_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateRdvs(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du rdv patient :', error);
    }
  };

  export const fetchRdv = async (rdv_id,updateRdv) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/rendez_vous/${rdv_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateRdv(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du rdv :', error);
    }
  };
