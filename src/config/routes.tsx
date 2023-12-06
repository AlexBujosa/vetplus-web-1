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
import { StoreOutlined } from '@mui/icons-material'
import GeneralViewPage from '@/pages/[admin]/clinic/general-info'
import AuthLayout from '@/layout/auth'
import Layout from '@/layout/admin'
import NotificationsPage from '@/pages/[admin]/notifications'
import ProfilePage from '@/pages/[admin]/profile'
import AppointmentsPage from '@/pages/[admin]/appointments'
import ClientsDetailPage from '@/pages/[admin]/clients/detail-page'
import AppointmentDetail from '@/pages/[admin]/appointments/appointment-detail'
import AppointmentForm from '@/pages/[admin]/appointments/appointment-form'

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
        allowedRoles,
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
      notifications: {
        href: '/notifications',
        page: <NotificationsPage />,
        show: false,
        allowedRoles,
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
