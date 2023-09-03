import axios from "axios";

export const fetchStade = async (stade_id,updateStade) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/stade/${stade_id}`, {
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

  export const fetchStadeMaladie = async (maladie_id,updateStades) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/maladie/stades/${maladie_id}`, {
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

 