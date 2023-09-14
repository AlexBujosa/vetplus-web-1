import { Imagotipo } from '@/components/logo'
import { NavLink } from 'react-router-dom'
import routes from '@/config/routes'
import cn from '@/utils/cn'
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined'
import useUser from '@/hooks/use-user'

export default function Sidebar() {
  return (
    <aside className='bg-base-neutral-gray-200 border-r border-r-base-neutral-gray-500 w-full max-w-[240px]'>
      <div className='flex flex-row justify-between border-b border-b-base-neutral-gray-500 px-[20px] py-[6px] mb-[30px]'>
        <Imagotipo width={108} height={54} />

        <button>
          <KeyboardDoubleArrowLeftOutlinedIcon className='text-base-primary-500' />
        </button>
      </div>

      <RouteOptions />
    </aside>
  )
}

function RouteOptions() {
  const { getUserRole } = useUser()

  const { role } = getUserRole()

  return (
    <div className='flex flex-col px-[20px]'>
      {routes.map(({ href, allowedRoles, page, ...rest }) => {
        if (!allowedRoles?.includes(role)) return

        return <Option key={href} href={href} {...rest} />
      })}
    </div>
  )
}

function Option({
  icon,
  name,
  href,
}: {
  icon: React.ReactNode
  name: string
  href: string
}) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'flex flex-row items-center px-3 py-[10px] gap-x-[20px] h-[45px] w-[200px] hover:bg-base-neutral-gray-500 rounded-[10px]',
          isActive ? 'text-base-primary-500' : 'text-base-neutral-gray-700'
        )
      }
      to={href}
    >
      {icon}
      {name}
    </NavLink>
  )
}
