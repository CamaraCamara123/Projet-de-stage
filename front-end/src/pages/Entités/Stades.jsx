import React, { useState, useEffect } from 'react';

import { calculateRange, sliceData } from '../../utils/table-pagination';

import '../styles.css';
import { useUserData } from '../../contexts/UserDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye, faAnglesUp, faAnglesDown, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { fetchStade } from '../../components/fetchElement/fetchStades';
import Form_delete_stade from '../../components/form/form_delete_stade';
import { fetchStadeImages } from '../../components/fetchElement/fetchImages';
import { Navigate } from 'react-router-dom';
import Transition from '../../constants/transition';

function Stades() {
  const { stades } = useUserData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [filteredStades, setFilteredStades] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const [modalIsOpen5, setModalIsOpen5] = useState(false);
  const { stade, updateStade, maladie, updateImages } = useUserData();


  useEffect(() => {
    setPagination(calculateRange(stades, 5));
    setFilteredStades(sliceData(stades, page, 5));
  }, [stades]);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = stades.filter(
        (stade) =>
          stade.stade.toLowerCase().includes(search.toLowerCase()) ||
          stade.description.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredStades(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setFilteredStades(sliceData(stades, new_page, 5));
  };


  const fdetail = (stade_id) => {
    fetchStadeImages(stade_id, updateImages)
    fetchStade(stade_id, updateStade);
    modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
    if (stade && stade.stade_id == stade_id) {
    }
  }

  const fdelete = (stade_id) => {
    fetchStade(stade_id, updateStade);
    modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
  }


  return (
    <Transition>
      <div className='dashboard-content'>
        <div className='dashboard-content-container'>
          <div className='dashboard-content-header'>
            <h2>LEVEL LIST </h2>
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
              <th>LEVEL</th>
              <th>DESCRIPTION</th>
              <th>ACTIONS</th>
            </thead>

            {filteredStades.length !== 0 ? (
              <tbody>
                {filteredStades.map((stade, index) => (
                  <tr key={index}>
                    <td>
                      {stade.stade}
                    </td>
                    <td>
                      {stade.description}
                    </td>
                    <td>
                      <span>
                        <button className='btn btn-dark' title='detail' onClick={() => fdetail(stade._id)}>
                          <FontAwesomeIcon icon={faThLarge} />
                        </button>
                      </span>
                      <span>
                        <button className='btn btn-danger display-flex' title='suppression' onClick={() => fdelete(stade._id)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>

          {filteredStades.length !== 0 ? (
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

        {modalIsOpen2 && <Navigate to='/dashboard/detail_stade' />}
        {modalIsOpen3 && <Form_delete_stade open={modalIsOpen3} stadeToDelete={stade} />}
      </div>
    </Transition>
  );
}

export default Stades;
