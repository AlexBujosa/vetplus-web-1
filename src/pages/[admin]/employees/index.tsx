import Input from '@/components/input'
import { Title } from '@/components/typography'
import { SearchOutlined } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import Table, { Row } from '@/components/table'
import { useClinic } from '@/hooks/use-clinic'

export default function EmployeesPage() {
  const { getAllEmployees } = useClinic()

  const { data } = getAllEmployees()

  console.log(data)

  return (
    <>
      <Title.Large text='Empleados' />

      <Input
        className='w-[300px] bg-white text-base-neutral-gray-700 shadow-elevation-1'
        variant='outlined'
        placeholder='Buscar empleados...'
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

const columns = [
  'Nombre',
  'Correo electrónico',
  'Especialidad',
  'Estado',
  'Calificación',
]

const rows: Row[] = [
  {
    key: 'laura@gmail.com',
    values: [],
  },
]

// function ActiveBadge() {
//   return (
//     <Badge
//       className='text-semantic-success-600 bg-semantic-sucess-50'
//       label='Activo'
//     >
//       <div className='w-[5px] h-[5px] bg-base-semantic-success-200' />
//     </Badge>
//   );
// }

// function InactiveBadge() {
//   return (
//     <Badge
//       className='text-semantic-danger-600 bg-semantic-danger-50'
//       label='Inactivo'
//     >
//       <div className='w-[5px] h-[5px] bg-base-semantic-danger-200' />
//     </Badge>
//   );
// }
