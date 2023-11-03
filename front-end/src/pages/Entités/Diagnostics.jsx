import React, { useState, useEffect } from 'react';

import { calculateRange, sliceData } from '../../utils/table-pagination';
import NotificationIcon from '../../assets/icons/notification.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import './style.css';
import '../styles.css';
import { useUserData } from '../../contexts/UserDataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClipboardUser, faLungsVirus } from '@fortawesome/free-solid-svg-icons';
import Form_detail_diagnostic from '../../components/form/form_chart_diagnostic';
import Form_valide_diagnostic from '../../components/form/form_valide_diagnostic';
import Transition from '../../constants/transition';
import { fetchDiagnostic } from '../../components/fetchElement/fetchDiagnostic';
import Form_diagnostics from '../../components/form/form_diagnostics';
import { Table } from 'react-bootstrap';
import Form__delete_diagnostic from '../../components/form/form_delete_diagnostic';



function Diagnostics() {
    const { diagnostics, diagnostic } = useUserData();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);
    const [filteredDiagnostics, setfilteredDiagnostics] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [modalIsOpen3, setModalIsOpen3] = useState(false);
    const [modalIsOpen4, setModalIsOpen4] = useState(false);
    const [modalIsOpen5, setModalIsOpen5] = useState(false);
    const { consultation, path, updateDiagnostic } = useUserData();
    const [details, setDetails] = useState([]);
    const [typeGraph, setTypeGraph] = useState("column");

    useEffect(() => {
        setPagination(calculateRange(diagnostics, 5));
        setfilteredDiagnostics(sliceData(diagnostics, page, 5));
    }, [diagnostics]);

    // Search
    const __handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = diagnostics.filter(
                (diagnostic) =>
                    diagnostic.dateDiagnostic.toLowerCase().includes(search.toLowerCase()) ||
                    diagnostic.maladie.nom.toLowerCase().includes(search.toLowerCase())
            );
            setfilteredDiagnostics(search_results);
        } else {
            __handleChangePage(1);
        }
    };

    // Change Page
    const __handleChangePage = (new_page) => {
        setPage(new_page);
        setfilteredDiagnostics(sliceData(diagnostics, new_page, 5));
    };

    const fNewDiagnostic = () => {
        modalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
    }

    const fupdate = (diagnostic_id) => {
        fetchDiagnostic(path,diagnostic_id, updateDiagnostic);
        if (diagnostic && diagnostic_id == diagnostic._id) {
            modalIsOpen2 ? setModalIsOpen2(false) : setModalIsOpen2(true);
        }

    }

    const fdelete = (diagnostic_id) => {
        fetchDiagnostic(path,diagnostic_id, updateDiagnostic);
        modalIsOpen3 ? setModalIsOpen3(false) : setModalIsOpen3(true);
    }

    const fdetails = (diagnostic_id) => {
        setTypeGraph("column")
        fetchDiagnostic(path,diagnostic_id, updateDiagnostic);
        const tabDetails = [];
        if (diagnostic && diagnostic._id == diagnostic_id) {
            for (let i = 0; i < diagnostic.maladies.length; i++) {
                const newDetail = { label: diagnostic.maladies[i].nom, y: parseFloat(diagnostic.probabilities[i]) }
                tabDetails.push(newDetail)
                console.log(diagnostic.probabilities[i])
                if (diagnostic.probabilities[i] == 100.0) {
                    console.log("Un 100%")
                    setTypeGraph("stackedColumn100")
                }
            }
            setDetails(tabDetails)
            modalIsOpen4 ? setModalIsOpen4(false) : setModalIsOpen4(true);
        }
    }

    const fvalider = (diagnostic_id) => {
        fetchDiagnostic(path,diagnostic_id, updateDiagnostic);
        if (diagnostic && diagnostic._id == diagnostic_id) {
            modalIsOpen5 ? setModalIsOpen5(false) : setModalIsOpen5(true);
        }
    }

    return (
        <Transition>
            <div className='dashboard-content'>
                <div className='dashbord-header-container'>
                    <button className='dashbord-header-btn' onClick={fNewDiagnostic}>New diagnostic</button>
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
                </div>
                <div className='dashboard-content-container'>
                    <div className='dashboard-content-header'>
                        <h2><span style={{ color: 'gray', fontFamily: 'initial' }}>{consultation.rdv.patient.nom} {consultation.rdv.patient.prenom}</span> Diagnostic List</h2>
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

                    <Table bordered striped responsive>
                        <thead>
                            <th>DATE</th>
                            <th>HOUR</th>
                            <th>DISEASE</th>
                            <th>PROBABILITY</th>
                            <th>IMAGE</th>
                            <th>ACTIONS</th>
                        </thead>

                        {filteredDiagnostics.length !== 0 ? (
                            <tbody>
                                {filteredDiagnostics.map((diagnostic, index) => (
                                    <tr key={index}>

                                        <td>
                                            <span>{new Date(diagnostic.dateDiagnostic).toISOString().split('T')[0]}</span>
                                        </td>
                                        <td>
                                            <span>
                                                {new Date(diagnostic.dateDiagnostic).getHours()}:{new Date(diagnostic.dateDiagnostic).getMinutes()}
                                            </span>

                                        </td>
                                        <td>
                                            <span>{diagnostic.maladie ? diagnostic.maladie.nom : "Nothing"}</span>
                                        </td>
                                        <td>
                                            <span>{diagnostic.probability ? `${diagnostic.probability}%` : "Nothing"}</span>
                                        </td>
                                        <td>
                                            <img src={`${path}/uploads/${diagnostic.imagePath}`} alt={diagnostic.imageName} width={50} height={50} />
                                        </td>
                                        <td>
                                            <span>
                                                <button className='elt-btn btn btn-primary' title='edit' onClick={() => fupdate(diagnostic._id)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </span>
                                            <span>
                                                <button className='elt-btn btn btn-danger display-flex' title='deletion' onClick={() => fdelete(diagnostic._id)}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </span>
                                            <span>
                                                <button className='elt-btn btn btn-dark' title='details of the diagnostic' onClick={() => fdetails(diagnostic._id)}>
                                                    <FontAwesomeIcon icon={faClipboardUser} />
                                                </button>
                                            </span>
                                            <span>
                                                <button className='elt-btn btn btn-success' title='valider diagnostic' onClick={() => fvalider(diagnostic._id)}>
                                                    <FontAwesomeIcon icon={faLungsVirus} />
                                                </button>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : null}
                    </Table>

                    {filteredDiagnostics.length !== 0 ? (
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
                {modalIsOpen && <Form_diagnostics open={modalIsOpen} consult_id={consultation._id} />}

                {modalIsOpen2 && <Form_diagnostics open={modalIsOpen2} consult_id={consultation._id} diagnosticToUpdate={diagnostic} />}
                {modalIsOpen3 && <Form__delete_diagnostic open={modalIsOpen3} diagnosticToDelete={diagnostic} />}
                {modalIsOpen4 && <Form_detail_diagnostic open={modalIsOpen4} details={details} type={typeGraph} diagnostic={diagnostic} />}
                {modalIsOpen5 && <Form_valide_diagnostic open={modalIsOpen5} diagnostic={diagnostic} />}
            </div>
        </Transition>
    );
}

export default Diagnostics;
