import Input from '@/components/input'
import { Body, Title } from '@/components/typography'
import { SearchOutlined } from '@mui/icons-material'
import { InputAdornment, Skeleton } from '@mui/material'
import Table, { Row } from '@/components/table'
import { useClinic } from '@/hooks/use-clinic'
import StarsReview from '@/components/stars-review'
import { Profile } from '@/components/profile'
import StatusBadge from '@/components/status-badge'
import { useAtom } from 'jotai'
import { Employee, employeesAtom } from '@/hooks/use-clinic/employeesAtom'
import { useEffect } from 'react'

const columns = [
  'Nombre',
  'Correo electrónico',
  'Especialidad',
  'Estado',
  'Calificación',
]

export default function EmployeesPage() {
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

      <EmployeesTable />
    </>
  )
}

function EmployeesTable() {
  const { getMyEmployees } = useClinic()
  const { data, loading } = getMyEmployees()
  const [currentEmployees, setCurrentEmployees] = useAtom(employeesAtom)

  useEffect(() => {
    if (data !== currentEmployees) setCurrentEmployees(data)
  }, [loading])

  const rows = !data ? TableLoadingRows() : EmployeesRowsValues(data)

  return <Table columns={columns} rows={rows} />
}

function TableLoadingRows(): Row[] {
  const numberOfSkeletons = 1

  return [
    {
      key: '',
      values: [...Array(numberOfSkeletons)].map((e, i) => <Skeleton key={i} />),
    },
  ]
}

function EmployeesRowsValues(employees: Employee[]): Row[] {
  return employees.map((employee) => {
    const { fullName, email, specialty, status, score } = employee

    const values = [
      <Profile profile={fullName} image={undefined} />,
      <Body.Medium className='text-base-neutral-gray-900' text={email} />,
      <Body.Medium className='text-base-neutral-gray-900' text={specialty} />,
      <StatusBadge status={status} />,
      <StarsReview review={score} />,
    ]

    return {
      key: email,
      values,
    }
  })
}
