import { Role } from '@/types/role'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import ClientsPage from '@/pages/[admin]/clients'
import EmployeesPage from '@/pages/[admin]/employees'
import EmployeesDetailPage from '@/pages/[admin]/employees/detail-page'
import ForgotPassword from '@/pages/[auth]/forgot-password'
import { Navigate } from 'react-router'
import Login from '@/pages/[auth]/login'
import { ChecklistOutlined, StoreOutlined } from '@mui/icons-material'
import GeneralViewPage from '@/pages/[admin]/clinic/general-info'
import AuthLayout from '@/layout/auth'
import Layout from '@/layout/admin'
import ProfilePage from '@/pages/[admin]/profile'
import AppointmentsPage from '@/pages/[admin]/appointments'
import ClientsDetailPage from '@/pages/[admin]/clients/detail-page'
import AppointmentDetail from '@/pages/[admin]/appointments/appointment-detail'
import AppointmentForm from '@/pages/[admin]/appointments/appointment-form'
import QueuePage from '@/pages/[admin]/queue'
import ClientAppointmentPage from '@/pages/[admin]/clients/client-appointment-detail'

type Routes = {
  auth: Route
  admin: Route
  'error-pages': Route
}

type Route = {
  layout?: JSX.Element
  pages: Record<
    string,
    {
      icon?: React.ReactNode
      page?: React.ReactNode
      href: string
      allowedRoles?: Role[]
      show?: boolean
    }
  >
}

export const allowedRoles = [Role.CLINIC_OWNER, Role.VETERINARIAN]

export const defaultRoute: Record<string, string> = {
  VETERINARIAN: '/appointments',
  CLINIC_OWNER: '/clients',
}

let routes: Routes = {
  auth: {
    layout: <AuthLayout />,
    pages: {
      index: {
        href: '/',
        page: <Navigate to='/login' />,
      },
      login: {
        href: '/login',
        page: <Login />,
      },
      'forgot-password': {
        href: '/forgot-password',
        page: <ForgotPassword />,
      },
    },
  },
  admin: {
    layout: <Layout />,
    pages: {
      clients: {
        href: '/clients',
        page: <ClientsPage />,
        icon: <PeopleOutlineOutlinedIcon />,
        allowedRoles: [Role.CLINIC_OWNER],
      },
      queue: {
        href: '/queue',
        page: <QueuePage />,
        icon: <ChecklistOutlined />,
        allowedRoles: [Role.CLINIC_OWNER],
        show: false,
      },
      'clients-detail': {
        show: false,
        href: '/clients/:email',
        page: <ClientsDetailPage />,
        allowedRoles,
      },
      appointments: {
        href: '/appointments',
        page: <AppointmentsPage />,
        icon: <EventOutlinedIcon />,
        allowedRoles,
      },
      employees: {
        href: '/employees',
        page: <EmployeesPage />,
        icon: <AssignmentIndOutlinedIcon />,
        allowedRoles: [Role.CLINIC_OWNER],
      },
      'employees-detail': {
        href: '/employees/:email',
        page: <EmployeesDetailPage />,
        allowedRoles: [Role.CLINIC_OWNER],
        show: false,
      },
      'general-view': {
        href: '/general-info',
        icon: <StoreOutlined />,
        page: <GeneralViewPage />,
        allowedRoles: [Role.CLINIC_OWNER],
      },
      'user-profile': {
        show: false,
        href: '/user-profile',
        page: <ProfilePage />,
        allowedRoles,
      },
      'appointment-detail': {
        show: false,
        href: '/appointment-detail',
        page: <AppointmentDetail />,
        allowedRoles,
      },
      'appointment-detail/:appointmentId': {
        show: false,
        href: '/appointment-detail/:appointmentId',
        page: <AppointmentForm />,
        allowedRoles,
      },
      'client-appointment/:appointmentId': {
        show: false,
        href: '/client-appointment/:appointmentId',
        page: <ClientAppointmentPage />,
        allowedRoles: [Role.CLINIC_OWNER],
      },
    },
  },
  'error-pages': {
    pages: {
      'not-found': {
        href: '*',
        page: <Navigate to='/' />,
      },
    },
  },
}

export { routes }
