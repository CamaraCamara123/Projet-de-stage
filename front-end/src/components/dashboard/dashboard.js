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
import { fetchRdvs, fetchMedecinRdvs, fetchPatientRdvs } from '../fetchElement/fetchRdvs';
import sidebar_menu_secretaire from '../../constants/sidebar_menu_secretaire';
import { fetchMedecinPatient, fetchMedecins } from '../fetchElement/fetchMedecins';
import { fetchConsultations } from '../fetchElement/fetchConsultations';
import { fetchMaladies } from '../fetchElement/fetchMaladies';
import '../../pages/styles.css'
import sidebar_menu_patient from '../../constants/siderbar_menu_patient';
import Transition from '../../constants/transition';


function Dashboard() {
  const { isLoggedIn, logout } = useAuth();
  const { userData, updateUserData, patients, updatePatients, updatePatient } = useUserData();
  const { medecins, updateMedecins, updateMedecin, medecin } = useUserData();
  const { secretaires, updateSecretaires, updateSecretaire } = useUserData();
  const { rdvs, updateRdvs } = useUserData();
  const { maladies, updateMaladies } = useUserData();
  const { consultations, updateConsultations } = useUserData();
  const { images, updateImages } = useUserData();
  const { stades, updateStades } = useUserData();

  //tableau de bord utilisateur
  const [sidermenu, setSiderMenu] = useState([]);
  const {updateAgenda, updatedDoctor_agenda} = useUserData();
  const colors = ['#FF5733', '#FFC300', '#36A2EB', '#4CAF50', '#E91E63'];

  const agenda = (medecins)=>{
    let doctorIdCounter = 0;
    let rdvIdCounter = 0;

    const updatedDoctors = [];
    const updatedMedecinRdvs = [];

    for (const medecin of medecins) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      const randomColor = colors[randomIndex];
      const newDoctor = {
        Id: doctorIdCounter,
        Text: `${medecin.nom} ${medecin.prenom}`,
        _id: medecin._id,
        Color: randomColor
      };
      updatedDoctors.push(newDoctor);

      for (const rdv_medecin of medecin.rdv) {
        const newRdv = {
          Id: rdvIdCounter,
          Subject: rdv_medecin.patient.nom,
          StartTime: rdv_medecin.dateDebutRdv,
          EndTime: rdv_medecin.dateFinRdv,
          DoctorId: [doctorIdCounter],
        };
        updatedMedecinRdvs.push(newRdv);

        rdvIdCounter++;
      }

      doctorIdCounter++;
    }


    updatedDoctor_agenda(updatedDoctors);
    updateAgenda(updatedMedecinRdvs);
    console.log("agenda : ", updatedDoctors)

  }

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const response = await axios.get('http://192.168.11.104:5000/api/users/current');
        updateUserData(response.data);
        localStorage.setItem('user', response.data)
        if (response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu);
          fetchPatients(updatePatients);
          fetchMedecins(updateMedecins);
          fetchSecretaires(updateSecretaires);
          fetchRdvs(updateRdvs);
          fetchConsultations(updateConsultations);
          fetchMaladies(updateMaladies);
          updateUserData(response.data);
        } else if (response.data.role.includes('medecin') && !response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu_medecin);
          fetchMedecinRdvs(response.data._id, updateRdvs);
          fetchSecretaires(updateSecretaires);
          agenda([response.data]);
          updateMedecin(response.data);
          fetchMaladies(updateMaladies);
          updateUserData(response.data);
          fetchMedecinPatient(response.data._id, updatePatients)
        } else if (response.data.role.includes('patient') && !response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu_patient);
          fetchPatientRdvs(response.data._id, updateRdvs);
          updatePatient(response.data)
          updateUserData(response.data);
        } else if (response.data.role.includes('secretaire') && !response.data.role.includes('admin')) {
          setSiderMenu(sidebar_menu_secretaire);
          fetchPatients(updatePatients)
          fetchMedecins(updateMedecins);
          fetchRdvs(updateRdvs);
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
