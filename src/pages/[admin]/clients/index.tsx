import React from 'react';
import Input from '@/components/input';
import { Title } from '@/components/typography';
import { SearchOutlined } from '@mui/icons-material';
import { Avatar, AvatarGroup, InputAdornment } from '@mui/material';
import Table, { Row } from '@/components/table';
import { Profile } from '@/components/profile';

export default function ClientsPage() {
  return (
    <>
      <Title.Large text='Clientes' />

      <Input
        className='w-[300px] bg-white text-base-neutral-gray-700 shadow-elevation-1'
        variant='outlined'
        placeholder='Buscar clientes...'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
      />

      <Table columns={columns} rows={rows} />
    </>
  );
}

const columns = [
  'Clientes',
  'Correo electrónico',
  'Mascotas',
  'Teléfono',
  'Ultima cita',
];

const rows: Row[] = [
  {
    key: 'christophertineo02@gmail.com',
    values: [
      <Profile profile='Christopher Tineo' />,
      'christophertineo02@gmail.com',
      <Pets />,
      '8095197108',
      '7 junio, 4:00 PM',
    ],
  },
  {
    key: 'christophertineo03@gmail.com',
    values: [
      <Profile profile='Christopher Tineo' />,
      'christophertineo02@gmail.com',
      <Pets />,
      '8095197108',
      '7 junio, 4:00 PM',
    ],
  },
  {
    key: 'christophertineo04@gmail.com',
    values: [
      <Profile profile='Christopher Tineo' />,
      'christophertineo02@gmail.com',
      <Pets />,
      '8095197108',
      '7 junio, 4:00 PM',
    ],
  },
];

function Pets() {
  const pets = ['Firu', 'Scott', 'Firu2', 'a'];

  return (
    <AvatarGroup max={4}>
      {pets.map((pet) => {
        return (
          <Avatar
            key={pet}
            className='w-8 h-8'
            alt={pet}
            src='images/placeholder.png'
          />
        );
      })}
    </AvatarGroup>
  );
}
