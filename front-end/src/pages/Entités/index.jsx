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
import { faEdit, faTrashAlt, faEye, faHouseMedicalFlag, faTowerObservation, faCat } from '@fortawesome/free-solid-svg-icons';
import Profile from '../profiles/Profile';
import { fetchPatientRdvs } from '../../components/fetchElement/fetchRdvs';
import Transition from '../../constants/transition';
import Form_rdv from '../../components/form/form_rdv';
import { fetchPatientMedecinVisite, fetchPatientVisite } from '../../components/fetchElement/fetchConsultations';
import { Table } from 'react-bootstrap';

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
  const [modalIsOpen6, setModalIsOpen6] = useState(false);
  const [modalIsOpen7, setModalIsOpen7] = useState(false);
  const { patient,
    updatePatient,
    updateMedecin,
    updateSecretaire,
    updateRdvs,
    userData,
    medecins,
    updateMedecinRdvs,
    medecinRdvs,
    updateDaysOff,
    updateDoublons,
    daysOff,
    doublons,
    updateConsultations,
    path
   } = useUserData();

  updateMedecin(null);
  // updatePatient(null);
  updateSecretaire(null)

  useEffect(() => {
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

    updateMedecinRdvs(updatedMedecinRdv);
  }, [medecins]);

  useEffect(() => {
    const freeDay = async () => {
      const listDayOff = {}
      const listdoublons = {}
      for (let doc of medecins) {
        let rdvIdCounter = 0;
        let tel = doc.tel;
        listdoublons[tel] = []
        const rdvsForMedecin = [];
        if (medecinRdvs[doc.tel]) {
          for (let rdv of medecinRdvs[doc.tel]) {
            const rdvForDate = getEventsForDate(new Date(rdv.StartTime), medecinRdvs[doc.tel]);
            const format = `${new Date(rdv.StartTime).getFullYear()}${new Date(rdv.StartTime).getMonth()}${new Date(rdv.StartTime).getDate()}`
            if (rdvForDate >= 3 && !listdoublons[tel].includes(format)) {
              const dateStart = new Date(rdv.StartTime)
              const dateEnd = new Date(rdv.EndTime)
              const newRdv = {
                Id: rdvIdCounter,
                Subject: 'Day Blocked',
                StartTime: dateStart,
                EndTime: dateEnd,
                color: '#FF5733',
                isBlock: true,
              }
              rdvsForMedecin.push(newRdv);
              rdvIdCounter++;
              listdoublons[tel].push(format)
            }
          }
          if (rdvsForMedecin.length != 0) {
            listDayOff[tel] = rdvsForMedecin
          }
        }

      }
      await updateDoublons(listdoublons)
      await updateDaysOff(listDayOff)
    };
    freeDay();
  }, [medecinRdvs])

  console.log("days off : ", daysOff)
  const getEventsForDate = (date, allRdvs) => {
    let nb = 0;
    for (let rdv of allRdvs) {
      const rdvDate = new Date(rdv.StartTime)
      console.log(rdvDate.getDate(), " == ", date.getDate(), " && ", rdvDate.getMonth(), " == ", date.getMonth())
      if (rdvDate.getDate() == date.getDate() && rdvDate.getMonth() == date.getMonth() && rdvDate.getFullYear() == date.getFullYear()) {
        nb++;
      }
    }
    return nb;
  };

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
          patient.prenom.toLowerCase().includes(search.toLowerCase()) ||
          patient.tel.toLowerCase().includes(search.toLowerCase())
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
      const response = await axios.get(`${path}/api/users/user/${user_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updatePatient(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du patient :', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false)
    setModalIsOpen4(false)
    setModalIsOpen2(false)
    setModalIsOpen3(false)
    setModalIsOpen5(false)
    setModalIsOpen6(false)
  }

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
    fetchPatientRdvs(path, user_id, updateRdvs);
    modalIsOpen5 ? setModalIsOpen5(false) : setModalIsOpen5(true);
  }

  const fmesVisits = (user_id) => {
    if (userData.role.includes('medecin')) {
      fetchPatientMedecinVisite(path, userData._id, user_id, updateConsultations)
    } else {
      fetchPatientVisite(path, user_id, updateConsultations);
    }
    modalIsOpen7 ? setModalIsOpen7(false) : setModalIsOpen7(true);
  }

  const fNewRdvs = (user_id) => {
    fetchPatient(user_id);
    modalIsOpen6 ? setModalIsOpen6(false) : setModalIsOpen6(true);
  }

  return (
    <Transition>
      <div className='dashboard-content'>
        {userData.role.includes('secretaire') && <div className='dashbord-header-container'>
          <button className='dashbord-header-btn' onClick={() => {
            closeModal()
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

          <Table responsive bordered striped>
            <thead>
              <th>PATIENT</th>
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
                      <span>{patient.nom} {patient.prenom}</span>
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
                      {userData.role.includes('secretaire') &&
                        <>
                          <span>
                            <button className='elt-btn btn btn-success' title='update' onClick={() => {

                              fupdate(patient._id)
                            }}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </span>
                          <span>
                            <button className='elt-btn btn btn-danger display-flex' title='delete' onClick={() => {
                              closeModal()
                              fdelete(patient._id)
                            }}>
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </span>
                        </>}
                      <span>
                        <button className='elt-btn btn btn-primary' title='profil' onClick={() => {
                          closeModal()
                          fview(patient._id)
                        }}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </span>
                      {userData.role.includes('secretaire') && <span>
                        <button className='elt-btn btn btn-dark' title='new appointment' onClick={() => {
                          closeModal()
                          fNewRdvs(patient._id)
                        }}>
                          <FontAwesomeIcon icon={faCat} />
                        </button>
                      </span>}
                      <span>
                        <button className='elt-btn btn btn-warning' title='My appoitments' onClick={() => fmesRdvs(patient._id)}>
                          <FontAwesomeIcon icon={faHouseMedicalFlag} />
                        </button>
                      </span>
                      <span>
                        <button className='elt-btn btn btn-info' title='My visits' onClick={() => fmesVisits(patient._id)}>
                          <FontAwesomeIcon icon={faTowerObservation} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </Table>

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
        {modalIsOpen6 && <Navigate to='/dashboard/form_rdv' />}
        {modalIsOpen7 && <Navigate to='/dashboard/visits' />}

      </div>
    </Transition>
  );
}

export default Patients;
