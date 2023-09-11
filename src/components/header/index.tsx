import React from 'react';
import useUser from '@/hooks/use-user';
import cn from '@/utils/cn';
import {
  ManageAccountsOutlined,
  NotificationsOutlined,
} from '@mui/icons-material';
import { Box, Divider, Popover } from '@mui/material';
import { Body, Label, Title } from '../typography';
import { useAtom } from 'jotai';
import { userAtom } from '@/hooks/use-user/userAtom';
import Button from '../button';
import useAuth from '@/hooks/use-auth';

export default function Header() {
  return (
    <header className='flex items-center justify-end w-full h-[60px] px-8 border border-base-neutral-gray-500 bg-base-neutral-white text-base-neutral-gray-700'>
      <div className='flex flex-row gap-x-[20px]'>
        <HeaderAction icon={<ManageAccountsOutlined />} />
        <HeaderAction icon={<NotificationsOutlined />} />
        <Profile />
      </div>
    </header>
  );
}

function HeaderAction({ icon }: { icon: React.ReactNode }) {
  return <button>{icon}</button>;
}

function Profile() {
  const { getUserProfile } = useUser();

  const { data: user, loading } = getUserProfile();

  const [anchorEl, setAnchorEl] = React.useState<HTMLImageElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <img
        className={cn(
          'w-[35px] h-[35px] rounded-full cursor-pointer',
          loading && 'animate-pulse'
        )}
        src={user?.image || 'images/placeholder.png'}
        onClick={handleClick}
      />

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
              <Label.Large text='Centro veterinario' />

              <ProfileWithName />
            </section>
          </Box>

          <Divider />

          <LogoutButton />
        </Box>
      </Popover>
    </>
  );
}

function ProfileWithName() {
  const [user] = useAtom(userAtom);

  if (!user) return null;

  const { image, names, surnames, email } = user;

  return (
    <div className='flex flex-row gap-x-5'>
      <img
        className='w-[60px] h-[60px] rounded-full'
        src={image || 'images/placeholder.png'}
      />

      <span>
        <Title.Medium text={`${names} ${surnames}`} />
        <Body.Medium className='text-base-neutral-gray-700' text={email} />
      </span>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button className='p-4' onClick={logout}>
      <Body.Medium
        className='text-base-semantic-warning-600 hover:text-base-semantic-warning-500'
        text='Cerrar sesión'
      />
    </button>
  );
}
