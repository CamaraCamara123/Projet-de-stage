import axios from "axios";

export const fetchMaladies = async (path,updateMaladies) => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  try {
    const response = await axios.get(`${path}/api/maladies`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateMaladies(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données maladies :', error);
  }
};

export const fetchMaladie = async (path,maladie_id,updateMaladie) => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  try {
    const response = await axios.get(`${path}/api/maladie/${maladie_id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    updateMaladie(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des données maladie :', error);
  }
};