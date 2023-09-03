import React, {useEffect, useState} from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import SideBarItem from './sidebar-item';

import './styles.css';
import LogoutIcon from '../../assets/icons/logout.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';


function SideBar ({ menu }) {
    const location = useLocation();

    const [active, setActive] = useState(1);
    const {logout} = useAuth()
    const {userData} = useUserData()

    useEffect(() => {
        menu.forEach(element => {
            if (location.pathname === element.path) {
                setActive(element.id);
            }
        });
    }, [location.pathname])

    const __navigate = (id) => {
        setActive(id);
    }

    const fLogout = ()=>{
        logout();
        return <Navigate to='/login'/>
    }

    return(
        <nav className='sidebar'>
            <div className='sidebar-container'>
                {/* <div className='sidebar-logo-container'>
                    <img
                        src={logo}
                        className='cercle'
                        alt="logo" />
                        <h3>{userData.username}</h3> 
                </div> */}

                <div className='sidebar-container'>
                    <div className='sidebar-items'>
                        {menu.map((item, index) => (
                            <div key={index} onClick={() => __navigate(item.id)}>
                                <SideBarItem
                                    active={item.id === active}
                                    item={item} />
                            </div>
                        ))}
                    </div>

                    <div className='sidebar-footer'>
                        <button className='sidebar-item-label btn-logout' onClick={()=>fLogout()}>Logout
                        <img 
                            src={LogoutIcon}
                            alt='icon-logout'
                            className='sidebar-item-icon' />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default SideBar;