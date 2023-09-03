import axios from 'axios';

export const fetchMedecins = async (updateMedecins) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.get('http://192.168.11.104:5000/api/users/dermatologue/all', {
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

export const fetchMedecin = async (user_id,updateMedecin) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/users/user/${user_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        }
      });
      updateMedecin(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du medecin :', error);
    }
  };

  export const fetchMedecinPatient = async (user_id,updatePatients) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/medecin/patients/${user_id}`, {
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

