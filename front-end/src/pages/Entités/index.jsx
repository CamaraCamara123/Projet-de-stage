import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/DashboardHeader';

import { calculateRange, sliceData } from '../../utils/table-pagination';

import '../styles.css';
import { useUserData } from '../../contexts/UserDataContext';
import NotificationIcon from '../../assets/icons/notification.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import Form from '../../components/form/form_patient';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Form_confirm_delete from '../../components/form/form_delete';
import { MDBIcon } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye, faHouseMedicalFlag } from '@fortawesome/free-solid-svg-icons';
import Profile from '../profiles/Profile';
import { fetchPatientMedecinRdvs, fetchPatientRdvs } from '../../components/fetchElement/fetchRdvs';
import Transition from '../../constants/transition';

function Patients() {
  const { patients } = useUserData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const [modalIsOpen5, setModalIsOpen5] = useState(false);
  const { patient, updatePatient, updateMedecin, updateSecretaire, updateRdvs, userData } = useUserData();

  updateMedecin(null);
  // updatePatient(null);
  updateSecretaire(null)

  const openModal = () => {
    modalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
  };

  useEffect(() => {
    setPagination(calculateRange(patients, 5));
    setFilteredPatients(sliceData(patients, page, 5));
  }, [patients]);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = patients.filter(
        (patient) =>
          patient.nom.toLowerCase().includes(search.toLowerCase()) ||
          patient.prenom.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPatients(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setFilteredPatients(sliceData(patients, new_page, 5));
  };

  const fetchPatient = async (user_id) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`http://192.168.11.104:5000/api/users/user/${user_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updatePatient(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du patient :', error);
    }
  };

  const fupdate = (user_id) => {
    fetchPatient(user_id);
    modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
  }

  const fdelete = (user_id) => {
    fetchPatient(user_id);
    console.log(patient);
    modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
  }

  const fview = async (user_id) => {
    fetchPatient(user_id);
    if (patient && patient._id == user_id) {
      modalIsOpen4 ? setModalIsOpen4(false) : setModalIsOpen4(true);
    }
  }

  const fmesRdvs = (user_id) => {
    if(userData.role.includes('medecin')&&!userData.role.includes('admin')){
      fetchPatientMedecinRdvs(userData._id,user_id,updateRdvs)
    }else{
      fetchPatientRdvs(user_id, updateRdvs);
    }
    
    modalIsOpen5 ? setModalIsOpen5(false) : setModalIsOpen5(true);
  }

  return (
    <Transition>
      <div className='dashboard-content'>
      {userData.role.includes('admin') &&<div className='dashbord-header-container'>
        <button className='dashbord-header-btn' onClick={() => {
          setModalIsOpen(false)
          setModalIsOpen4(false)
          setModalIsOpen2(false)
          setModalIsOpen3(false)
          setModalIsOpen5(false)
          openModal()
        }
        }>New patient</button>
        <div className='dashbord-header-right'>
          <img
            src={NotificationIcon}
            alt='notification-icon'
            className='dashbord-header-icon' />
          <img
            src={SettingsIcon}
            alt='settings-icon'
            className='dashbord-header-icon' />
          <img
            className='dashbord-header-avatar'
            src={userData.photo} />
        </div>
      </div>}

      <div className='dashboard-content-container'>
        <div className='dashboard-content-header'>
          <h2>Patients List</h2>
          <div className='dashboard-content-search'>
            <input
              type='text'
              value={search}
              placeholder='Search..'
              className='dashboard-content-input'
              onChange={(e) => __handleSearch(e)}
            />
          </div>
        </div>

        <table>
          <thead>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            {/* <th>Username</th> */}
            <th>ADDRESS</th>
            <th>PHONE</th>
            <th>GENDER</th>
            <th>ACTIONS</th>
          </thead>

          {filteredPatients.length !== 0 ? (
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr key={index}>
                  <td>
                    <span>{patient.nom}</span>
                  </td>
                  <td>
                    <span>{patient.prenom}</span>
                  </td>
                  {/* <td>
                    <span>{patient.username}</span>
                  </td> */}
                  <td>
                    <span>{patient.adresse}</span>
                  </td>
                  <td>
                    <span>{patient.tel}</span>
                  </td>
                  <td>
                    <span>{patient.genre}</span>
                  </td>
                  <td>
                    {userData.role.includes('admin') &&
                      <>
                        <span>
                          <button className='btn btn-success' title='mise à jour' onClick={() => {
                            setModalIsOpen(false)
                            setModalIsOpen4(false)
                            setModalIsOpen2(false)
                            setModalIsOpen3(false)
                            setModalIsOpen5(false)
                            fupdate(patient._id)
                          }}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </span>
                        <span>
                          <button className='btn btn-danger display-flex' title='supprimer' onClick={() => {
                            setModalIsOpen(false)
                            setModalIsOpen4(false)
                            setModalIsOpen2(false)
                            setModalIsOpen3(false)
                            setModalIsOpen5(false)
                            fdelete(patient._id)
                          }}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </span>
                      </>}
                    <span>
                      <button className='btn btn-primary' title='profile' onClick={() => {
                        setModalIsOpen(false)
                        setModalIsOpen4(false)
                        setModalIsOpen2(false)
                        setModalIsOpen3(false)
                        setModalIsOpen5(false)
                        fview(patient._id)
                      }}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </span>
                    <span>
                      <button className='btn btn-warning' title='les rendez-vous' onClick={() => fmesRdvs(patient._id)}>
                        <FontAwesomeIcon icon={faHouseMedicalFlag} />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {filteredPatients.length !== 0 ? (
          <div className='dashboard-content-footer'>
            {pagination.map((item, index) => (
              <span
                key={index}
                className={item === page ? 'active-pagination' : 'pagination'}
                onClick={() => __handleChangePage(item)}>
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className='dashboard-content-footer'>
            <span className='empty-table'>No data</span>
          </div>
        )}
      </div>
      {modalIsOpen && <Form open={modalIsOpen} />}
      {modalIsOpen2 && <Form open={modalIsOpen2} patientToUpdate={patient} />}
      {modalIsOpen3 && <Form_confirm_delete open={modalIsOpen3} userToDelete={patient} />}
      {modalIsOpen4 && <Profile />}
      {modalIsOpen5 && <Navigate to='/dashboard/rdv' />}
    </div>
    </Transition>
  );
}

export default Patients;
