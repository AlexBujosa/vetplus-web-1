import Input from '@/components/input'
import { Title } from '@/components/typography'
import { SearchOutlined } from '@mui/icons-material'
import { InputAdornment, Skeleton } from '@mui/material'
import Table, { Row } from '@/components/table'
import { useTranslation } from 'react-i18next'
import { useClinic } from '@/hooks/use-clinic'

export default function ClientsPage() {
  const { t } = useTranslation()
  // const { getMyClients } = useClinic()
  // const { data, loading } = getMyClients()

  const columns = [
    t('clients'),
    t('email'),
    t('pets'),
    t('telephone-number'),
    t('last-appointment'),
  ]

  const rows = TableLoadingRows()

  function TableLoadingRows(): Row[] {
    return [
      {
        key: '',
        values: [...Array(columns.length)].map(() => <Skeleton />),
      },
    ]
  }

  // function ClientsRowValues(client: any[]): Row[] {
  //   return client.map((employee) => {
  //     const { fullName, email, specialty, status, score } = employee

  //     const values = [
  //       <Profile profile={fullName} image={undefined} />,
  //       <Body.Medium className='text-base-neutral-gray-900' text={email} />,
  //       <Body.Medium className='text-base-neutral-gray-900' text={specialty} />,
  //       <StatusBadge status={status} />,
  //       <StarsReview review={score} />,
  //     ]

  //     return {
  //       key: email,
  //       values,
  //     }
  //   })
  // }

  return (
    <>
      <Title.Large text={t('clients')} />

      <Input
        className='w-[300px] bg-white text-base-neutral-gray-700 shadow-elevation-1'
        variant='outlined'
        placeholder={t('search-clients')}
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
  )
}

// function Pets() {
//   const pets = ['Firu', 'Scott', 'Firu2', 'a']

//   return (
//     <AvatarGroup max={4}>
//       {pets.map((pet) => {
//         return (
//           <Avatar
//             key={pet}
//             className='w-8 h-8'
//             alt={pet}
//             src='/images/placeholder.png'
//           />
//         )
//       })}
//     </AvatarGroup>
//   )
// }
