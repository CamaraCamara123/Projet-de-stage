import React, { useState, useEffect } from 'react';

import { calculateRange, sliceData } from '../../utils/table-pagination';

import './style.css';
import { useUserData } from '../../contexts/UserDataContext';
import NotificationIcon from '../../assets/icons/notification.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt,faHeartbeat, faPeopleCarry } from '@fortawesome/free-solid-svg-icons';
import Form_rdv from '../../components/form/form_rdv';
import Form__delete_rdv from '../../components/form/form_delete_rdv';
import { fetchMedecinRdvs, fetchRdv, fetchRdvs } from '../../components/fetchElement/fetchRdvs';
import Form_consultation from '../../components/form/form_consult';
import { fetchConsultationsRdv } from '../../components/fetchElement/fetchConsultations';
import Transition from '../../constants/transition';
import Form__validate_rdv from '../../components/form/form_validate_rdv';
import { Table } from 'react-bootstrap';

function Rdvs() {
  const { rdvs } = useUserData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [FilteredRdvs, setFilteredRdvs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const [modalIsOpen5, setModalIsOpen5] = useState(false);
  const [modalIsOpen6, setModalIsOpen6] = useState(false);
  const [modalIsOpen7, setModalIsOpen7] = useState(false);
  const { rdv, updateRdv, updateRdvs, updateConsultations, userData, medecins, path } = useUserData();
  const [doctor, setDoctor] = useState([]);
  const [rendez_vous, setRendez_vous] = useState([]);
  const colors = ['#FF5733', '#FFC300', '#36A2EB', '#4CAF50', '#E91E63'];

  useEffect(() => {
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


    setDoctor(updatedDoctors);
    setRendez_vous(updatedMedecinRdvs);
  }, [medecins]);

  const fAllRdvsMedecin = async()=>{
    await fetchMedecinRdvs(path,userData._id,updateRdvs)
  }
  const fAllRdvs = async()=>{
    await fetchRdvs(path,updateRdvs)
  }

  useEffect(() => {
    setPagination(calculateRange(rdvs, 5));
    setFilteredRdvs(sliceData(rdvs, page, 5));
  }, [rdvs]);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = rdvs.filter(
        (rdv) =>
          (rdv.patient?.nom?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
          (rdv.patient?.prenom?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
          (rdv.medecint?.nom?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
          (rdv.medecin?.prenom?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
          (rdv.medecin?.tel?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
          (rdv.dateDebutRdv?.toLowerCase() ?? '').includes(search.toLowerCase())||
          (rdv.patient?.tel?.toLowerCase() ?? '').includes(search.toLowerCase())
      );
      setFilteredRdvs(search_results);
    } else {
      __handleChangePage(1);
    }
  };


  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setFilteredRdvs(sliceData(rdvs, new_page, 5));
  };

  const fupdate = (rdv_id) => {
    fetchRdv(path,rdv_id, updateRdv);
    modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
  }

  const fdelete = (rdv_id) => {
    fetchRdv(path,rdv_id, updateRdv);
    modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
  }

  const fconfirm = (rdv_id) => {
    fetchRdv(path,rdv_id, updateRdv);
    if (rdv && rdv._id == rdv_id) {
      modalIsOpen4 ? setModalIsOpen4(false) : setModalIsOpen4(true);
    }
  }

  const fvalidation = (rdv_id) => {
    fetchRdv(path,rdv_id, updateRdv)
    if (rdv && rdv._id == rdv_id) {
      modalIsOpen6 ? setModalIsOpen6(false) : setModalIsOpen6(true);
    }
  }

  const fConsultations = (rdv_id) => {
    fetchRdv(path,rdv_id, updateRdv)
    fetchConsultationsRdv(path,rdv_id, updateConsultations)
    if (rdv && rdv._id == rdv_id) {
      modalIsOpen7 ? setModalIsOpen7(false) : setModalIsOpen7(true);
    }
  }

  return (
    <Transition>
      <div className='dashboard-content'>
        {(userData.role.includes('secretaire')|| userData.role.includes('medecin'))&& <div className='dashbord-header-container'>
          <button className='dashbord-header-btn' onClick={() => {
            setModalIsOpen(false)
            setModalIsOpen4(false)
            setModalIsOpen2(false)
            setModalIsOpen3(false)
            setModalIsOpen5(false)
            setModalIsOpen6(false)
            userData.role.includes('secretaire')?fAllRdvs():fAllRdvsMedecin()
          }}>More</button>
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
            <h2>APPOITEMENT LIST</h2>
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

          <Table striped bordered hover responsive>
            <thead className='tabHead'>
              <th>PATIENT</th>
              <th>DOCTOR</th>
              <th>PHONE</th>
              <th>DATE</th>
              <th>HOUR</th>
              <th>STATUT</th>
              <th>Actions</th>
            </thead>

            {FilteredRdvs.length !== 0 ? (
              <tbody>
                {FilteredRdvs.map((rdv, index) => (
                  <tr key={index}>
                    <td>
                      <span>{rdv.patient.nom} {rdv.patient.prenom}</span>
                    </td>
                    <td>
                      <span>{rdv.medecin.nom} {rdv.medecin.prenom}</span>
                    </td>
                    <td>
                      <span>{rdv.patient.tel}</span>
                    </td>
                    <td>
                      <span>{new Date(rdv.dateDebutRdv).toISOString().split('T')[0]}</span>
                    </td>
                    <td>
                      <span>
                        {
                          `${new Date(rdv.dateDebutRdv).getHours()}:${String(new Date(rdv.dateDebutRdv).getMinutes()).padStart(2, '0')}`
                        }

                      </span>

                    </td>
                    <td>
                    <span>{rdv.statut?"confirmed":"waiting"}</span>
                  </td>
                    <td>
                      {userData.role.includes('secretaire') &&
                        <>
                          <span>
                            <button className='elt-btn btn btn-primary' title='update' onClick={() => {
                              setModalIsOpen(false)
                              setModalIsOpen4(false)
                              setModalIsOpen2(false)
                              setModalIsOpen3(false)
                              setModalIsOpen5(false)
                              setModalIsOpen6(false)
                              fupdate(rdv._id)
                            }}>
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </span>
                          <span>
                            {<button className='elt-btn btn btn-danger display-flex' title='delete' onClick={() => {
                              setModalIsOpen(false)
                              setModalIsOpen4(false)
                              setModalIsOpen2(false)
                              setModalIsOpen3(false)
                              setModalIsOpen5(false)
                              setModalIsOpen6(false)
                              fdelete(rdv._id)
                            }}>
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>}
                          </span>
                        </>}

                      {!rdv.statut && (userData.role.includes('secretaire'))&& <>
                        <span>
                          <button className='elt-btn btn btn-info display-flex' title='appointment validation' onClick={() => {
                            setModalIsOpen(false)
                            setModalIsOpen4(false)
                            setModalIsOpen2(false)
                            setModalIsOpen3(false)
                            setModalIsOpen5(false)
                            fvalidation(rdv._id)
                          }}>
                            <FontAwesomeIcon icon={faHeartbeat} />
                          </button>
                        </span>
                      </>}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </Table>

          {FilteredRdvs.length !== 0 ? (
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
        {/* {modalIsOpen && <Form_rdv open={modalIsOpen} doctor={doctor} rdvs={rendez_vous} />} */}
        {modalIsOpen2 && <Navigate to='/dashboard/form_rdv' />}
        {modalIsOpen3 && <Form__delete_rdv open={modalIsOpen3} rdvToDelete={rdv} />}
        {/* {modalIsOpen4 && <Form_confirm_rdv open={modalIsOpen4} rdv_id={rdv._id} />}
      {modalIsOpen5 && <Form_cancel_rdv open={modalIsOpen5} rdv_id={rdv._id} />} */}
        {modalIsOpen6 && <Form__validate_rdv open={modalIsOpen6} rdvToValidate={rdv} />}
        {modalIsOpen7 && <Navigate to='/dashboard/consultations' />}
      </div>
    </Transition>
  );
}

export default Rdvs;
