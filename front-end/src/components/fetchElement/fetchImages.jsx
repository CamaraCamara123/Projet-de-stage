import axios from 'axios';

export const fetchStadeImages = async (path,stade_id,updateImages) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
        const response = await axios.get(`${path}/api/maladie/stade/images/${stade_id}`, {
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