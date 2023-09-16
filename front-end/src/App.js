import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserDataProvider, useUserData } from './contexts/UserDataContext';
import './App.css';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Dashboard from './components/dashboard/dashboard';
import NavBar from './components/navBar/NavBar';
import Patients from './pages/Entités';
import Medecins from './pages/Entités/Medecins';
import Secretaires from './pages/Entités/Secretaires';
import Rdvs from './pages/Entités/Rdvs';
import Malades from './pages/Entités/Maladies';
import Consultations from './pages/Entités/Consultations';
import DossierMedical from './pages/profiles/DossierMedical';
import Stades from './pages/Entités/Stades';
import Account from './pages/profiles/Account';
import Form_detail_stade from './components/form/form_detail_stade';
import Agenda_medecin from './components/form/Agenda_medecin';
import DashboardInfos from './components/dashboard/dashboardInfos';
import { AnimatePresence } from 'framer-motion';
import Form_rdv from './components/form/form_rdv';
import Diagnostics from './pages/Entités/Diagnostics';


function App() {
  const isLoggedIn = useAuth();

  return (
    <AuthProvider>
      <UserDataProvider>
        <Router>
          <NavBar />
          <div className='app-container'>
            <AnimatePresence>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/dashboard/*' element={<Dashboard />}>
                <Route index element={<DashboardInfos />} />
                <Route path='patients' element={<Patients />} />
                <Route path='account' element={<Account />} />
                <Route path='medecins' element={<Medecins />} />
                <Route path='secretaires' element={<Secretaires />} />
                <Route path='visits' element={<Consultations />} />
                <Route path='diagnostics' element={<Diagnostics />} />
                <Route path='stades' element={<Stades />} />
                <Route path='dossiers' element={<DossierMedical />} />
                <Route path='detail_stade' element={<Form_detail_stade />} />
                <Route path='rdv' element={<Rdvs />} />
                <Route path='form_rdv' element={<Form_rdv />} />
                <Route path='maladies' element={<Malades />} />
                <Route path='agenda' element={<Agenda_medecin />} />
              </Route>
            </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
