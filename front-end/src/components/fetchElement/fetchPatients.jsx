import axios from 'axios';

const fetchPatients = async (path,updatePatients) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log(token)
    try {
        const response = await axios.get(`${path}/api/users/patient/all`, {
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
