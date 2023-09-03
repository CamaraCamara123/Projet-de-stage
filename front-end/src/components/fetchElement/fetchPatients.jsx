import axios from 'axios';

const fetchPatients = async (updatePatients) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log(token)
    try {
        const response = await axios.get('http://192.168.11.104:5000/api/users/patient/all', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            }
        });
        updatePatients(response.data);
        console.log(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données patients :', error);
    }
};

export default fetchPatients;
