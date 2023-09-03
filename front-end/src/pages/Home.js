import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'
import { Button } from 'react-bootstrap';
import { useUserData } from '../contexts/UserDataContext';
import Transition from '../constants/transition';

function Home() {
  const {userData} = useUserData()
  return (
    <Transition>
      <div className='home-container' style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 className='home-title'>WELCOME ON DERMATO PAGE</h2>
    </div>
    </Transition>
  );
}

export default Home;
