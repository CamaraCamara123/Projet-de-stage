import React, { useState, useEffect } from 'react';

import { calculateRange, sliceData } from '../../utils/table-pagination';

import '../styles.css';
import { useUserData } from '../../contexts/UserDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClipboardUser, faSuitcaseMedical, faLungsVirus } from '@fortawesome/free-solid-svg-icons';
import { fetchConsultation } from '../../components/fetchElement/fetchConsultations';
import Form_consultation from '../../components/form/form_consult';
import Form__delete_consultation from '../../components/form/form_delete_consult';
import Form_detail_consultation from '../../components/form/form_chart_consultaton';
import Form_valide_diagnostic from '../../components/form/form_valide_diagnostic';
import Transition from '../../constants/transition';

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
  const { consultation, updateConsultation } = useUserData();
  const [details, setDetails] = useState([])

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


  const fupdate = (consultation_id) => {
    fetchConsultation(consultation_id, updateConsultation);
    if (consultation && consultation_id == consultation._id) {
      modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
    }

  }

  const fdelete = (consultation_id) => {
    fetchConsultation(consultation_id, updateConsultation);
    modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
  }

  const fdetails = (consultation_id) => {
    fetchConsultation(consultation_id, updateConsultation);
    const tabDetails = [];
    if (consultation && consultation._id == consultation_id) {
      for (let i = 0; i < consultation.maladies.length; i++) {
        const newDetail = { label: consultation.maladies[i].nom, y: parseFloat(consultation.probabilities[i]) }
        tabDetails.push(newDetail)
      }
      setDetails(tabDetails)
      console.log(tabDetails)
      modalIsOpen4 ? setModalIsOpen4(false) : setModalIsOpen4(true);
    }
  }

  const fvalider = (consultation_id) => {
    fetchConsultation(consultation_id, updateConsultation);
    if (consultation && consultation._id == consultation_id) {
      modalIsOpen5 ? setModalIsOpen5(false) : setModalIsOpen5(true);
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

          <table>
            <thead>
              <th>PATIENT NUMBER</th>
              <th>DATE</th>
              <th>HOUR</th>
              <th>DISEASE</th>
              <th>PROBABILITY</th>
              <th>ACTIONS</th>
            </thead>

            {filteredConsultations.length !== 0 ? (
              <tbody>
                {filteredConsultations.map((consultation, index) => (
                  <tr key={index}>
                    <td>
                      <span>{consultation.rdv.patient.tel}</span>
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
                      <span>{consultation.maladie ? consultation.maladie.nom : "Nothing"}</span>
                    </td>
                    <td>
                      <span>{consultation.probability ? `${consultation.probability}%` : "Nothing"}</span>
                    </td>
                    <td>
                      <span>
                        <button className='btn btn-primary' title='edit' onClick={() => fupdate(consultation._id)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </span>
                      <span>
                        <button className='btn btn-danger display-flex' title='deletion' onClick={() => fdelete(consultation._id)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </span>
                      <span>
                        <button className='btn btn-dark' title='details of the consultation' onClick={() => fdetails(consultation._id)}>
                          <FontAwesomeIcon icon={faClipboardUser} />
                        </button>
                      </span>
                      <span>
                        <button className='btn btn-success' title='valider diagnostic' onClick={() => fvalider(consultation._id)}>
                          <FontAwesomeIcon icon={faLungsVirus} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>

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
        {modalIsOpen2 && <Form_consultation open={modalIsOpen2} rdv_id={consultation.rdv._id} consultationToUpdate={consultation} />}
        {modalIsOpen3 && <Form__delete_consultation open={modalIsOpen3} consultationToDelete={consultation} />}
        {modalIsOpen4 && <Form_detail_consultation open={modalIsOpen4} details={details} consultation={consultation} />}
        {modalIsOpen5 && <Form_valide_diagnostic open={modalIsOpen5} consult={consultation} />}
      </div>
    </Transition>
  );
}

export default Consultations;
