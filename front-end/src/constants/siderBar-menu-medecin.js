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
import AgendaIcon from '../assets/icons/agenda.svg';

const sidebar_menu_medecin = [
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
        title: 'My appointments',
    },
    {
        id: 3,
        icon: ExamenIcon,
        path: '/dashboard/maladies',
        title: 'Disease management',
    },
    // {
    //     id: 4,
    //     icon: ShippingIcon,
    //     path: '/dashboard/mesPatients',
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
        icon: PatientIcon,
        path: '/dashboard/patients',
        title: 'My patients',
    },
    {
        id: 5,
        icon: PatientIcon,
        path: '/dashboard/visits',
        title: 'Today visits',
    },
    {
        id: 6,
        icon: AgendaIcon,
        path: '/dashboard/agenda',
        title: 'My timeslots',
    },
    {
        id: 7,
        icon: UserIcon,
        path: '/dashboard/account',
        title: 'My account',
    }
]


export default sidebar_menu_medecin;