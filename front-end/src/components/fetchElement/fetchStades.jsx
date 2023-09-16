import axios from "axios";

export const fetchStade = async (path,stade_id,updateStade) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/stade/${stade_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateStade(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du stade :', error);
    }
  };

  export const fetchStadeMaladie = async (path,maladie_id,updateStades) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/maladie/stades/${maladie_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateStades(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données des stades de la maladie :', error);
    }
  };

 