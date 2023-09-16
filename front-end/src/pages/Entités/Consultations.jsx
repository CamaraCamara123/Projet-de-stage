import React, { useState, useEffect } from 'react';

import { calculateRange, sliceData } from '../../utils/table-pagination';

import '../styles.css';
import { useUserData } from '../../contexts/UserDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClipboardUser, faSuitcaseMedical, faLungsVirus } from '@fortawesome/free-solid-svg-icons';
import { fetchConsultation } from '../../components/fetchElement/fetchConsultations';
// import Form_consultation from '../../components/form/form_consult';
import Form__delete_consultation from '../../components/form/form_delete_consult';
// import Form_detail_consultation from '../../components/form/form_chart_diagnostic';
// import Form_valide_diagnostic from '../../components/form/form_valide_diagnostic';
import Transition from '../../constants/transition';
import { Navigate } from 'react-router-dom';
import { fetchConsultationDiagnostic } from '../../components/fetchElement/fetchDiagnostic';
import './style.css';
import { Table } from 'react-bootstrap';

function Consultations() {
  const { consultations } = useUserData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const [modalIsOpen5, setModalIsOpen5] = useState(false);
  const { consultation, updateConsultation, updateDiagnostics, userData, path } = useUserData();


  useEffect(() => {
    setPagination(calculateRange(consultations, 5));
    setFilteredConsultations(sliceData(consultations, page, 5));
  }, [consultations]);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = consultations.filter(
        (consultation) =>
          consultation.dateConsult.toLowerCase().includes(search.toLowerCase()) ||
          consultation.heure.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredConsultations(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setFilteredConsultations(sliceData(consultations, new_page, 5));
  };


  // const fupdate = (consultation_id) => {
  //   fetchConsultation(consultation_id, updateConsultation);
  //   if (consultation && consultation_id == consultation._id) {
  //     modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
  //   }

  // }

  const fdelete = (consultation_id) => {
    fetchConsultation(path,consultation_id, updateConsultation);
    if (consultation && consultation_id == consultation._id) {
      if(userData.role.includes('secretaire')&&consultation.diagnostics.length !=0){
        alert("Impossible to delete this visit, it contains diagnostics")
        return;
      }
    modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
  }
  }

  const fdiagnostics = (consultation_id) => {
    fetchConsultation(path,consultation_id, updateConsultation);
    fetchConsultationDiagnostic(path,consultation_id, updateDiagnostics)
    if (consultation && consultation._id == consultation_id) {
      modalIsOpen4 ? setModalIsOpen4(false) : setModalIsOpen4(true);
    }
  }

  return (
    <Transition>
      <div className='dashboard-content'>
        {/* <div className='dashbord-header-container'>
        {/* <button className='dashbord-header-btn' onClick={openModal}>New consultation</button> 
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
            src='https://reqres.in/img/faces/9-image.jpg' />
        </div>
      </div> */}
        <div className='dashboard-content-container'>
          <div className='dashboard-content-header'>
            <h2>CONSULTATION LIST</h2>
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

          <Table responsive striped bordered>
            <thead>
              <th>PATIENT</th>
              <th>PATIENT TEL</th>
              <th>DOCTOR</th>
              <th>DATE</th>
              <th>HOUR</th>
              <th>ACTIONS</th>
            </thead>
            {filteredConsultations.length !== 0 ? (
              <tbody>
                {filteredConsultations.map((consultation, index) => (
                  <tr key={index}>
                    <td>
                      <span>{consultation.rdv.patient.nom} {consultation.rdv.patient.prenom}</span>
                    </td>
                    <td>
                      <span>{consultation.rdv.patient.tel}</span>
                    </td>
                    <td>
                      <span>{consultation.rdv.medecin.nom} {consultation.rdv.medecin.prenom}</span>
                    </td>
                    <td>
                      <span>{new Date(consultation.dateConsult).toISOString().split('T')[0]}</span>
                    </td>
                    <td>
                      <span>
                        {new Date(consultation.dateConsult).getHours()}:{new Date(consultation.dateConsult).getMinutes()}
                      </span>

                    </td>
                    <td>
                      {/* <span>
                        <button className='elt-btn btn btn-primary' title='edit' onClick={() => fupdate(consultation._id)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </span> */}
                      <span>
                        <button className='elt-btn btn btn-danger display-flex' title='deletion' onClick={() => fdelete(consultation._id)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </span>
                      {userData.role.includes('medecin') &&!userData.role.includes('admin')&& <span>
                        <button className='elt-btn btn btn-dark' title='diagnostics' onClick={() => fdiagnostics(consultation._id)}>
                          <FontAwesomeIcon icon={faClipboardUser} />
                        </button>
                      </span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </Table>

          {filteredConsultations.length !== 0 ? (
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
        {/* {modalIsOpen && <Form_consultation open={modalIsOpen} />}*/}
        {/* {modalIsOpen2 && <Form_consultation open={modalIsOpen2} consultationToUpdate={consultation} />} */}
        {modalIsOpen3 && <Form__delete_consultation open={modalIsOpen3} consultationToDelete={consultation} />}
        {modalIsOpen4 && <Navigate to='/dashboard/diagnostics' />}
        {/* {modalIsOpen5 && <Form_valide_diagnostic open={modalIsOpen5} consult={consultation} />} */}
      </div>
    </Transition>
  );
}

export default Consultations;
