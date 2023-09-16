import axios from "axios";


export const fetchRdvs = async (path,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/rendez_vous`, {
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


export const fetchMedecinRdvs = async (path,user_id,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/rendez_vous/dermatologue/${user_id}`, {
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

  export const fetchPatientRdvs = async (path,user_id,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/rendez_vous/patient/${user_id}`, {
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

  export const fetchMedecinFuturRdvs = async (path,medecin_id,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/rdv/dermatologue/futur/${medecin_id}`, {
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

  export const fetchMedecinTodayRdvs = async (path,medecin_id,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/rendez-vous/dermatologue/today/${medecin_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateRdvs(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des rdv d\'aujourd\'hui :', error);
    }
  };

  export const fetchRdv = async (path,rdv_id,updateRdv) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/rendez_vous/${rdv_id}`, {
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

  // tous les rdvs du jour
  export const fetchDayRdvs = async (path,updateRdvs) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/rendez_vous/today`, {
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
