import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/DashboardHeader';

import { calculateRange, sliceData } from '../../utils/table-pagination';

import '../styles.css';
import { useUserData } from '../../contexts/UserDataContext';
import NotificationIcon from '../../assets/icons/notification.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import axios from 'axios';
import Form_confirm_delete from '../../components/form/form_delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import Form_secretaire from '../../components/form/form_secretaire';
import Profile from '../profiles/Profile';
import Transition from '../../constants/transition';
import { Table } from 'react-bootstrap';
import './style.css'

function Secretaires() {
  const { secretaires, userData } = useUserData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [filteredSecretaires, setFilteredSecretaires] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const { secretaire, updatePatient, updateMedecin, updateSecretaire, path } = useUserData();

  updateMedecin(null);
  updatePatient(null);
  // updateSecretaire(null)

  const openModal = () => {
    modalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
  };

  useEffect(() => {
    setPagination(calculateRange(secretaires, 5));
    setFilteredSecretaires(sliceData(secretaires, page, 5));
  }, [secretaires]);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = secretaires.filter(
        (secretaire) =>
          secretaire.nom.toLowerCase().includes(search.toLowerCase()) ||
          secretaire.prenom.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSecretaires(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setFilteredSecretaires(sliceData(secretaires, new_page, 5));
  };

  const fetchSecretaire = async (user_id) => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get(`${path}/api/users/user/${user_id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      updateSecretaire(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données du secretaire :', error);
    }
  };

  const fupdate = (user_id) => {
    fetchSecretaire(user_id);
    modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
  }

  const fdelete = (user_id) => {
    fetchSecretaire(user_id);
    modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
  }

  const fview = (user_id) => {
    console.log(user_id)
    fetchSecretaire(user_id);
    if (secretaire && user_id == secretaire._id) {
      modalIsOpen4 ? setModalIsOpen4(false) : setModalIsOpen4(true);
    }
  }

  return (
    <Transition>
      <div className='dashboard-content'>
        <div className='dashbord-header-container'>
          <button className='dashbord-header-btn' onClick={() => {
            setModalIsOpen(false)
            setModalIsOpen4(false)
            setModalIsOpen2(false)
            setModalIsOpen3(false)
            openModal()
          }}>New Secretary</button>
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
        </div>

        <div className='dashboard-content-container'>
          <div className='dashboard-content-header'>
            <h2>Secretaires List</h2>
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
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>USERNAME</th>
              {/* <th>Adresse</th> */}
              <th>PHONE</th>
              <th>GENDER</th>
              <th>ACTIONS</th>
            </thead>

            {filteredSecretaires.length !== 0 ? (
              <tbody>
                {filteredSecretaires.map((secretaire, index) => (
                  <tr key={index}>
                    <td>
                      <span>{secretaire.nom}</span>
                    </td>
                    <td>
                      <span>{secretaire.prenom}</span>
                    </td>
                    <td>
                      <span>{secretaire.username}</span>
                    </td>
                    {/* <td>
                    <span>{secretaire.adresse}</span>
                  </td> */}
                    <td>
                      <span>{secretaire.tel}</span>
                    </td>
                    <td>
                      <span>{secretaire.genre}</span>
                    </td>
                    <td>
                      <span>
                        <button className='elt-btn btn btn-success' onClick={() => {
                          setModalIsOpen(false)
                          setModalIsOpen4(false)
                          setModalIsOpen2(false)
                          setModalIsOpen3(false)
                          fupdate(secretaire._id)
                        }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </span>
                      <span>
                        <button className='elt-btn btn btn-danger display-flex' onClick={() => {
                          setModalIsOpen(false)
                          setModalIsOpen4(false)
                          setModalIsOpen2(false)
                          setModalIsOpen3(false)
                          fdelete(secretaire._id)
                        }}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </span>
                      <span>
                        <button className='elt-btn btn btn-primary' onClick={() => {
                          setModalIsOpen(false)
                          setModalIsOpen4(false)
                          setModalIsOpen2(false)
                          setModalIsOpen3(false)
                          fview(secretaire._id)
                        }}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </Table>

          {filteredSecretaires.length !== 0 ? (
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
        {modalIsOpen && <Form_secretaire open={modalIsOpen} />}
        {modalIsOpen2 && <Form_secretaire open={modalIsOpen2} secretaireToUpdate={secretaire} />}
        {modalIsOpen3 && <Form_confirm_delete open={modalIsOpen3} userToDelete={secretaire} />}
        {modalIsOpen4 && <Profile />}
      </div>
    </Transition>
  );
}

export default Secretaires;
