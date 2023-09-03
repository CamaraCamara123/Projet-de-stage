import axios from "axios";

export const fetchConsultations = async (updateConsultations) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get('http://192.168.11.104:5000/api/consultations', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateConsultations(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données consultations :', error);
    }
  };

  export const fetchConsultation = async (consult_id,updateConsultation) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/consultation/${consult_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateConsultation(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données consultation :', error);
    }
  };

  export const fetchConsultationsRdv = async (rdv_id,updateConsultations) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/rdv/consultation/${rdv_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateConsultations(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données consultations :', error);
    }
  };
