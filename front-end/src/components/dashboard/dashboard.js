import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'; // Utilisez Outlet pour rendre les routes imbriquées

import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import SideBar from '../Sidebar';
import sidebar_menu from '../../constants/sidebar-menu';
import sidebar_menu_medecin from '../../constants/siderBar-menu-medecin';
import axios from 'axios';
import fetchPatients from '../fetchElement/fetchPatients';
import fetchSecretaires from '../fetchElement/fetchSecretaires';
import { fetchRdvs, fetchPatientRdvs, fetchMedecinTodayRdvs, fetchDayRdvs } from '../fetchElement/fetchRdvs';
import sidebar_menu_secretaire from '../../constants/sidebar_menu_secretaire';
import { fetchMedecinPatient, fetchMedecins } from '../fetchElement/fetchMedecins';
import { fetchConsultations, fetchMedecinDayConsultations } from '../fetchElement/fetchConsultations';
import { fetchMaladies } from '../fetchElement/fetchMaladies';
import '../../pages/styles.css'
import sidebar_menu_patient from '../../constants/siderbar_menu_patient';
import Transition from '../../constants/transition';



function Dashboard() {
  const { isLoggedIn, logout } = useAuth();
  const {updateUserData, updatePatients, updatePatient } = useUserData();
  const { updateMedecins, updateMedecin} = useUserData();
  const { updateSecretaires, updateSecretaire } = useUserData();
  const {updateRdvs } = useUserData();
  const { updateMaladies } = useUserData();
  const { updateConsultations } = useUserData();

  //tableau de bord utilisateur
  const [sidermenu, setSiderMenu] = useState([]);
  const {updateAgenda, path} = useUserData();
  const agenda = (medecins)=>{
    const updatedMedecinRdv = {};

    for (const medecin of medecins) {
      let rdvIdCounter = 0;
      let tel = medecin.tel;
      const rdvsForMedecin = [];

      for (const rdv_medecin of medecin.rdv) {
        const newRdv = {
          Id: rdvIdCounter,
          Subject: rdv_medecin.patient.nom,
          StartTime: rdv_medecin.dateDebutRdv,
          EndTime: rdv_medecin.dateFinRdv,
          Color: '#FF5733'
        };
        rdvsForMedecin.push(newRdv);

        rdvIdCounter++;
      }

      updatedMedecinRdv[tel] = rdvsForMedecin;
    }

    updateAgenda(updatedMedecinRdv);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const response = await axios.get(`${path}/api/users/current`);
        updateUserData(response.data);
        localStorage.setItem('user', response.data)
        if (response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu);
          fetchPatients(path,updatePatients);
          fetchMedecins(path,updateMedecins);
          fetchSecretaires(path,updateSecretaires);
          fetchRdvs(path,updateRdvs);
          fetchConsultations(path,updateConsultations);
          fetchMaladies(path,updateMaladies);
          updateUserData(response.data);
        } else if (response.data.role.includes('medecin') && !response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu_medecin);
          fetchMedecinTodayRdvs(path,response.data._id, updateRdvs);
          fetchSecretaires(path,updateSecretaires);
          agenda([response.data]);
          updateMedecin(response.data);
          fetchMaladies(path,updateMaladies);
          updateUserData(response.data);
          fetchMedecinPatient(path,response.data._id, updatePatients)
          fetchMedecinDayConsultations(path,response.data._id,updateConsultations)
        } else if (response.data.role.includes('patient') && !response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu_patient);
          fetchPatientRdvs(path,response.data._id, updateRdvs);
          updatePatient(response.data)
          updateUserData(response.data);
        } else if (response.data.role.includes('secretaire') && !response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu_secretaire);
          fetchPatients(path,updatePatients)
          fetchMedecins(path,updateMedecins);
          fetchDayRdvs(path,updateRdvs);
          updateSecretaire(response.data)
          updateUserData(response.data);

        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        logout()
        return <Navigate to='/login' />;
      }
    };

    fetchUserData();
  }, []);


  if (!isLoggedIn) {
    return <Navigate to='/login' />;
  }

  return (
    <Transition>
      <div className='dashboard-container'>
      <SideBar menu={sidermenu} />
      <div className='dashboard-content'>
        <Outlet />
      </div>
    </div>
  </Transition>
  );
}

export default Dashboard;
