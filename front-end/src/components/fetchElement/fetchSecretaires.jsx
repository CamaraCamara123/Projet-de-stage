import axios from "axios";

const fetchSecretaires = async (updateSecretaires) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get('http://192.168.11.104:5000/api/users/secretaires', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateSecretaires(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données secretaires :', error);
    }
  };

  export default fetchSecretaires;