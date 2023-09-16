import axios from "axios";


export const fetchConsultationDiagnostic = async (path,consult_id,updateDiagnostics) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/consultation/diagnostics/${consult_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateDiagnostics(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des diagnostics:', error);
    }
  };

  export const fetchDiagnostic = async (path,diagnostic_id,updateDiagnostic) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/diagnostic/${diagnostic_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateDiagnostic(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données de diagnostic :', error);
    }
  };
