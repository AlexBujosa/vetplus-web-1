import useUser from '@/hooks/use-user'
import cn from '@/utils/cn'
import {
  ManageAccountsOutlined,
  NotificationsOutlined,
} from '@mui/icons-material'
import { Box, Divider, Popover, Stack, Switch } from '@mui/material'
import { Body, Title } from '../typography'
import { useAtom } from 'jotai'
import { userAtom } from '@/hooks/use-user/userAtom'
import useAuth from '@/hooks/use-auth'

import { useTranslation } from 'react-i18next'
import { languages } from '@/i18n'
import ProfileImage from '../profile-image'
import Image from '@/components/image'
import { NavLink } from 'react-router-dom'
import { routes } from '@/config/routes'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import('dayjs/locale/es')
import('dayjs/locale/en')

export default function Header() {
  return (
    <header className='flex items-center justify-between w-full h-[60px] px-8 border border-base-neutral-gray-500 bg-base-neutral-white text-base-neutral-gray-700'>
      <LanguageSwitch />
      <div className='flex flex-row items-center gap-x-[20px]'>
        <NavLink
          className={({ isActive }) =>
            cn(
              isActive ? 'text-base-primary-500' : 'text-base-neutral-gray-700'
            )
          }
          to={routes.admin.pages['user-profile'].href}
        >
          <ManageAccountsOutlined />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            cn(
              isActive ? 'text-base-primary-500' : 'text-base-neutral-gray-700'
            )
          }
          to={routes.admin.pages.notifications.href}
        >
          <NotificationsOutlined />
        </NavLink>
        <Profile />
      </div>
    </header>
  )
}

function LanguageSwitch() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguage = event.target.checked ? languages[1] : languages[0]
    i18n.changeLanguage(newLanguage)
    dayjs.locale(i18n.language)
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <Body.Large text={t(languages[0])} />
      <Switch defaultChecked onChange={handleLanguageChange} />
      <Body.Large text={t(languages[1])} />
    </Stack>
  )
}

function Profile() {
  const { getUserProfile } = useUser()

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <button aria-describedby={id} onClick={handleClick}>
        <Image
          className={cn(
            'w-[35px] h-[35px] rounded-full cursor-pointer',
            loading && 'animate-pulse'
          )}
          src={user?.image}
        />
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ borderRadius: '8px' }}>
          <Box sx={{ p: 1.6 }}>
            <section className='flex flex-col gap-y-5'>
              <ProfileWithName />
            </section>
          </Box>

          <Divider />

          <LogoutButton />
        </Box>
      </Popover>
    </>
  )
}

function ProfileWithName() {
  const [user] = useAtom(userAtom)

  if (!user) return null

  const { image, names, surnames, email, role } = user
  const fullName = surnames ? names.concat(' ', surnames) : names

  return (
    <div className='flex flex-row gap-x-5'>
      <ProfileImage className='w-[60px] h-[60px]' src={image} loading />

      <span>
        <Title.Medium text={fullName} />
        <Body.Medium className='text-base-neutral-gray-700' text={role} />
        <Body.Medium className='text-base-neutral-gray-700' text={email} />
      </span>
    </div>
  )
}

function LogoutButton() {
  const { logout } = useAuth()
  const { t } = useTranslation()

  return (
    <button className='p-4' onClick={logout}>
      <Body.Medium
        className='text-base-semantic-warning-600 hover:text-base-semantic-warning-500'
        text={t('logout')}
      />
    </button>
  )
}
