import React, { useState, useEffect } from 'react';

import { calculateRange, sliceData } from '../../utils/table-pagination';

import '../styles.css';
import { useUserData } from '../../contexts/UserDataContext';
import NotificationIcon from '../../assets/icons/notification.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Form_confirm_delete from '../../components/form/form_delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import Form_maladie from '../../components/form/form_maladie';
import { fetchStadeMaladie } from '../../components/fetchElement/fetchStades';
import { fetchMaladie, fetchMaladies } from '../../components/fetchElement/fetchMaladies';
import Form_delete_maladie from '../../components/form/form_delete_maladie';
import userEvent from '@testing-library/user-event';
import Transition from '../../constants/transition';

function Maladies() {
  const { maladies, userData } = useUserData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [filteredmaladies, setfilteredMaladies] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const { maladie, updateMaladie, updateStades } = useUserData()
  const { updateUserIdData } = useUserData();

  const openModal = () => {
    modalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
  };

  useEffect(() => {
    setPagination(calculateRange(maladies, 5));
    setfilteredMaladies(sliceData(maladies, page, 5));
  }, [maladies]);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = maladies.filter(
        (maladie) =>
          maladie.nom.toLowerCase().includes(search.toLowerCase())
        // ||
        // maladie.code.toLowerCase().includes(search.toLowerCase())
      );
      setfilteredMaladies(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setfilteredMaladies(sliceData(maladies, new_page, 5));
  };


  const fupdate = (maladie_id) => {
    fetchMaladie(maladie_id, updateMaladie);
    modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
  }

  const fdelete = (maladie_id) => {
    fetchMaladie(maladie_id, updateMaladie);
    modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
  }

  const fstades = (maladie_id) => {
    console.log(maladie_id)
    fetchMaladie(maladie_id, updateMaladie);
    fetchStadeMaladie(maladie_id, updateStades)
    console.log(maladie)
    modalIsOpen4 ? setModalIsOpen4(false) : setModalIsOpen4(true);
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
          }}>New DISEASE</button>
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
            <h2>DISEASES LIST</h2>
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
              <th>NAME</th>
              <th>LEVELS</th>
              <th>UPDATE</th>
              <th>DELETE</th>
            </thead>

            {filteredmaladies.length !== 0 ? (
              <tbody>
                {filteredmaladies.map((maladie, index) => (
                  <tr key={index}>
                    <td>
                      <span>{maladie.nom}</span>
                    </td>
                    <td>
                      <span>
                        <button className='btn btn-primary' onClick={() => {
                          setModalIsOpen(false)
                          setModalIsOpen4(false)
                          setModalIsOpen2(false)
                          setModalIsOpen3(false)
                          fstades(maladie._id)
                        }}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </span>
                    </td>
                    <td>
                      <span>
                        <button className='btn btn-success' onClick={() => {
                          setModalIsOpen(false)
                          setModalIsOpen4(false)
                          setModalIsOpen2(false)
                          setModalIsOpen3(false)
                          fupdate(maladie._id)
                        }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </span>
                    </td>
                    <td>
                      <span>
                        <button className='btn btn-danger display-flex' onClick={() => {
                          setModalIsOpen(false)
                          setModalIsOpen4(false)
                          setModalIsOpen2(false)
                          setModalIsOpen3(false)
                          fdelete(maladie._id)
                        }}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>

          {filteredmaladies.length !== 0 ? (
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
        {modalIsOpen && <Form_maladie open={modalIsOpen} />}
        {modalIsOpen2 && <Form_maladie open={modalIsOpen2} maladieToUpdate={maladie} />}
        {modalIsOpen4 && <Navigate to='/dashboard/stades' />}
        {modalIsOpen3 && <Form_delete_maladie open={modalIsOpen3} maladieToDelete={maladie} />}
      </div>
    </Transition>
  );
}

export default Maladies;
