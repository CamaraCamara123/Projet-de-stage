import axios from "axios";

const fetchSecretaires = async (path,updateSecretaires) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/users/secretaires`, {
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