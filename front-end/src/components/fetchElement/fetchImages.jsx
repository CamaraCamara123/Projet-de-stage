import axios from 'axios';

export const fetchStadeImages = async (stade_id,updateImages) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.get(`http://192.168.11.104:5000/api/maladie/stade/images/${stade_id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        updateImages(response.data);
        console.log(response.data)
    } catch (error) {
        console.error('Erreur lors de la récupération des données Images :', error);
    }
};