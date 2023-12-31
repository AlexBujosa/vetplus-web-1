import { Imagotipo } from '@/components/logo'
import { NavLink } from 'react-router-dom'
import { routes as adminRoutes } from '@/config/routes'
import cn from '@/utils/cn'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import { roleAtom } from '@/hooks/use-auth/roleAtom'

export default function Sidebar() {
  return (
    <aside className='bg-white border-r border-r-base-neutral-gray-500 w-full max-w-[240px]'>
      <div className='flex flex-col px-[20px] py-[6px] mb-[30px] h-full'>
        <Imagotipo className='mb-3' width={120} height={54} />
        <RouteOptions />
      </div>
    </aside>
  )
}

function RouteOptions() {
  const role = useAtomValue(roleAtom)

  const routes = Object.entries(adminRoutes.admin.pages)

  const options = routes.filter(([_key, value]) => {
    const { allowedRoles, show } = value
    return allowedRoles?.includes(role!) && show !== false
  })

  return (
    <>
      {options.map(([key, value]) => {
        const { href, ...rest } = value
        return <Option key={href} href={href} name={key} {...rest} />
      })}
    </>
  )
}

function Option({
  icon,
  name,
  href,
}: {
  icon?: React.ReactNode
  name: string
  href: string
}) {
  const { t } = useTranslation()

  const labelName = t(name)

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
      {labelName}
    </NavLink>
  )
}
