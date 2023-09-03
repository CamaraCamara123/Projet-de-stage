import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';
import MedecinIcon from '../assets/icons/medecine.svg';
import PatientIcon from '../assets/icons/patient.svg';
import KitIcon from '../assets/icons/kit-medical.svg';


const sidebar_menu_secretaire = [
    {
        id: 1,
        icon: DashboardIcon,
        path: '/dashboard/',
        title: 'Dashboard',
    },
    {
        id: 2,
        icon: KitIcon,
        path: '/dashboard/rdv',
        title: 'Appointment management',
    },
    {
        id: 3,
        icon: PatientIcon,
        path: '/dashboard/patients',
        title: 'Patients',
    },
    // {
    //     id: 4,
    //     icon: ShippingIcon,
    //     path: '/dashboard/consultation',
    //     title: 'Consultations en cours',
    // },
    // {
    //     id: 5,
    //     icon: ShippingIcon,
    //     path: '/dashboard/consultation',
    //     title: 'Historique consultation',
    // },
    {
        id: 4,
        icon: UserIcon,
        path: '/dashboard/account',
        title: 'My account',
    }
]


export default sidebar_menu_secretaire;