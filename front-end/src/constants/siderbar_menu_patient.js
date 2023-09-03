import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';
import DossierIcon from '../assets/icons/dossier-medical.svg';
import DocteurIcon from '../assets/icons/docteur.svg';
import EquipeIcon from '../assets/icons/equipe-medicale (1).svg';
import ExamenIcon from '../assets/icons/examen.svg';
import PatientIcon from '../assets/icons/patient.svg';
import KitIcon from '../assets/icons/kit-medical.svg';

const sidebar_menu_patient = [
    {
        id: 1,
        icon: DashboardIcon,
        path: '/dashboard/',
        title: 'Dashboard',
    },
    {
        id: 2,
        icon: DossierIcon,
        path: '/dashboard/rdv',
        title: ' My appointments',
    },
    // {
    //     id: 3,
    //     icon: MedecinIcon,
    //     path: '/dashboard/maladie',
    //     title: 'Gestion maladies',
    // },
    // {
    //     id: 4,
    //     icon: ShippingIcon,
    //     path: '/dashboard/consultation',
    //     title: 'Consultations en cours',
    // },
    {
        id: 3,
        icon: PatientIcon,
        path: '/dashboard/dossiers',
        title: 'Medical file',
    },
    {
        id: 4,
        icon: UserIcon,
        path: '/dashboard/account',
        title: 'My account',
    }
]


export default sidebar_menu_patient;