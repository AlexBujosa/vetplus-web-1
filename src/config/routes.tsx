import { Role } from '@/types/role'
import HomeIcon from '@mui/icons-material/Home'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DashboardPage from '@/pages/[admin]'
import ClientsPage from '@/pages/[admin]/clients'
import EmployeesPage from '@/pages/[admin]/employees'

type Route = {
  icon: React.ReactNode
  page?: React.ReactNode
  name: string
  href: string
  allowedRoles?: Role[]
}

export const allowedRoles = [Role.CLINIC_OWNER, Role.VETERINARIAN]

const routes: Route[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    page: <DashboardPage />,
    icon: <HomeIcon />,
    allowedRoles,
  },
  {
    name: 'Clientes',
    href: '/clients',
    page: <ClientsPage />,
    icon: <PeopleOutlineOutlinedIcon />,
    allowedRoles,
  },
  {
    name: 'Citas',
    href: '/appointments',
    icon: <EventOutlinedIcon />,
    allowedRoles,
  },
  {
    name: 'Empleados',
    href: '/employees',
    page: <EmployeesPage />,
    icon: <AssignmentIndOutlinedIcon />,
    allowedRoles: [Role.CLINIC_OWNER],
  },
  {
    name: 'Configuración',
    href: '/configuration',
    icon: <SettingsOutlinedIcon />,
    allowedRoles,
  },
]

export default routes
