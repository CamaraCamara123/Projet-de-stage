import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';
import MedecinIcon from '../assets/icons/medecine.svg';
import DossierIcon from '../assets/icons/dossier-medical.svg';
import DocteurIcon from '../assets/icons/docteur.svg';
import EquipeIcon from '../assets/icons/equipe-medicale (1).svg';
import ExamenIcon from '../assets/icons/examen.svg';
import PatientIcon from '../assets/icons/patient.svg';
import KitIcon from '../assets/icons/kit-medical.svg';

const sidebar_menu = [
    {
        id: 1,
        icon: DashboardIcon,
        path: '/dashboard/',
        title: 'Dashboard',
    },
    {
        id: 2,
        icon: PatientIcon,
        path: '/dashboard/patients',
        title: 'Patients',
    },
    {
        id: 3,
        icon: DocteurIcon,
        path: '/dashboard/medecins',
        title: 'Doctors',
    },
    {
        id: 4,
        icon: EquipeIcon,
        path: '/dashboard/secretaires',
        title: 'Secretaries',
    },
    // {
    //     id: 5,
    //     icon: ShippingIcon,
    //     path: '/dashboard/rdv',
    //     title: 'Rendez-vous',
    // },
    // ,
    // {
    //     id: 6,
    //     icon: ShippingIcon,
    //     path: '/dashboard/consultations',
    //     title: 'consultation',
    // },
    {
        id: 6,
        icon: KitIcon,
        path: '/dashboard/maladies',
        title: 'Diseases',
    },
    {
        id: 7,
        icon: UserIcon,
        path: '/dashboard/account',
        title: 'My account',
    }
]


export default sidebar_menu;