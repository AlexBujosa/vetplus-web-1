import { Imagotipo } from '@/components/logo'
import { NavLink } from 'react-router-dom'
import { routes as adminRoutes } from '@/config/routes'
import cn from '@/utils/cn'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import { roleAtom } from '@/hooks/use-auth/roleAtom'
import { Box } from '@mui/material'
import { useState } from 'react'
import { Modal as MuiModal } from '@mui/material'
import Modal from '../molecules/modal'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <aside className='bg-white border-r border-r-base-neutral-gray-500 w-full max-w-[240px]'>
      <div className='flex flex-col px-[20px] py-[6px] mb-[30px] h-full'>
        <Imagotipo className='mb-3' width={120} height={54} />
        <RouteOptions />
        <button
          className='flex flex-row items-center px-3 gap-x-[20px] h-[45px] w-[200px] hover:bg-base-neutral-gray-500 rounded-[10px] text-base-neutral-gray-700'
          onClick={handleOpen}
        >
          <img
            src='..\images\HelpOutline.png'
            alt='help'
            width={24}
            height={24}
          />
          Ayuda
        </button>
      </div>

      <MuiModal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Modal title='Vetplus a tu ritmo' sections={[<HelpLinks />]} />
        </Box>
      </MuiModal>
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

function HelpLinks() {
  const links = [
    {
      text: 'Iniciar sesión en Vetplus Web',
      url: 'https://scribehow.com/shared/Iniciando_sesion_en_Vetplus_Web__VHez9ilfSM2uSYi6ECXf7w',
    },
    {
      text: 'Editar información general de mi perfil',
      url: 'https://scribehow.com/shared/Editar_informacion_general_de_mi_perfil__ALBbdvjuRhiloQoU8uXt7w',
    },
    {
      text: 'Editar perfil del centro',
      url: 'https://scribehow.com/shared/Editar_perfil_del_centro__b4GeAFboSxqKqv51XrQV5A',
    },
    {
      text: 'Editar horario del centro',
      url: 'https://scribehow.com/shared/Editar_horario_de_centro_veterinario__RZtFY7AaRcWAL06kpH0IWQ',
    },
    {
      text: 'Invitar veterinario',
      url: 'https://scribehow.com/shared/Invitar_empleado__FcG39Lz8RHSIFuQGPS1hZQ',
    },
    {
      text: 'Ver datos de una cita programada',
      url: 'https://scribehow.com/shared/Ver_datos_de_una_cita___wn0IBsKTziUCVK-TROG_A',
    },
    {
      text: 'Ver notificaciones de citas',
      url: 'https://scribehow.com/shared/Ver_notificaciones_de_citas__21WAkc_GQnCpNTPfdFZWXQ',
    },
    {
      text: 'Aceptar o Negar cita',
      url: 'https://scribehow.com/shared/Aceptar_o_denegar_Cita__CE7CD2pmSfmpDmd9kAUwXg',
    },
    // {
    //   text: "Link 3",
    //   url: "/link3",
    // },
    // {
    //   text: "Link 3",
    //   url: "/link3",
    // },
    // {
    //   text: "Link 3",
    //   url: "/link3",
    // },
    // {
    //   text: "Link 3",
    //   url: "/link3",
    // },
    // {
    //   text: "Link 3",
    //   url: "/link3",
    // },
    // {
    //   text: "Link 3",
    //   url: "/link3",
    // },
  ]

  return (
    <div>
      <ul className='text-base-neutral-gray-700'>
        {links.map((link, index) => (
          <li key={index}>
            <a className='hover:text-blue-700' href={link.url} target='_blank'>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
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
