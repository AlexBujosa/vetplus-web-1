import { Role } from '@/types/role'
import HomeIcon from '@mui/icons-material/Home'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DashboardPage from '@/pages/[admin]'
import ClientsPage from '@/pages/[admin]/clients'
import EmployeesPage from '@/pages/[admin]/employees'
import EmployeesDetailPage from '@/pages/[admin]/employees/detail-page'
import ForgotPassword from '@/pages/[auth]/forgot-password'
import { Navigate } from 'react-router'
import Login from '@/pages/[auth]/login'
import { StoreOutlined } from '@mui/icons-material'
import GeneralViewPage from '@/pages/[admin]/clinic/general-view'

type Route = {
  icon?: React.ReactNode
  page?: React.ReactNode
  name: string
  href: string
  allowedRoles?: Role[]
  show?: boolean
}

export const allowedRoles = [Role.CLINIC_OWNER, Role.VETERINARIAN]

const routes: Route[] = [
  {
    name: 'dashboard',
    href: '/admin',
    page: <DashboardPage />,
    icon: <HomeIcon />,
    allowedRoles,
  },
  {
    name: 'clients',
    href: '/clients',
    page: <ClientsPage />,
    icon: <PeopleOutlineOutlinedIcon />,
    allowedRoles,
  },
  {
    name: 'appointments',
    href: '/appointments',
    icon: <EventOutlinedIcon />,
    allowedRoles,
  },
  {
    name: 'employees',
    href: '/employees',
    page: <EmployeesPage />,
    icon: <AssignmentIndOutlinedIcon />,
    allowedRoles: [Role.CLINIC_OWNER],
  },
  {
    name: 'employees-detail',
    href: '/employees/:email',
    page: <EmployeesDetailPage />,
    allowedRoles: [Role.CLINIC_OWNER],
    show: false,
  },
  {
    name: 'general-view',
    href: '/general-info',
    icon: <StoreOutlined />,
    page: <GeneralViewPage />,
    allowedRoles: [Role.CLINIC_OWNER],
  },
]

const authRoutes: Route[] = [
  {
    name: 'index',
    href: '/',
    page: <Navigate to='/login' />,
  },
  {
    name: 'login',
    href: '/login',
    page: <Login />,
  },
  {
    name: 'forgot password',
    href: '/forgot-password',
    page: <ForgotPassword />,
  },
]

export { routes, authRoutes }
