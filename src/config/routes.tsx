import { Role } from '@/types/role'
import HomeIcon from '@mui/icons-material/Home'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import DashboardPage from '@/pages/[admin]'
import ClientsPage from '@/pages/[admin]/clients'
import EmployeesPage from '@/pages/[admin]/employees'
import EmployeesDetailPage from '@/pages/[admin]/employees/detail-page'
import ForgotPassword from '@/pages/[auth]/forgot-password'
import { Navigate } from 'react-router'
import Login from '@/pages/[auth]/login'
import { StoreOutlined } from '@mui/icons-material'
import GeneralViewPage from '@/pages/[admin]/clinic/general-view'
import AuthLayout from '@/layout/auth'
import Layout from '@/layout/admin'

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
      dashboard: {
        href: '/dashboard',
        page: <DashboardPage />,
        icon: <HomeIcon />,
        allowedRoles,
      },
      clients: {
        href: '/clients',
        page: <ClientsPage />,
        icon: <PeopleOutlineOutlinedIcon />,
        allowedRoles,
      },
      appointments: {
        href: '/appointments',
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
