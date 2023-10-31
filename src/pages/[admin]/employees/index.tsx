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
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

export default function EmployeesPage() {
  const { t } = useTranslation()

  return (
    <>
      <Title.Large text={t('employees')} />

      <div className='flex flex-row items-center justify-between'>
        <Input
          className='w-[300px] bg-white text-base-neutral-gray-700 shadow-elevation-1'
          variant='outlined'
          placeholder={t('search-employees')}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />

        {/* <Button size='small' icon={<AddOutlined />} label={t('create')} /> */}
      </div>

      <EmployeesTable />
    </>
  )
}

function EmployeesTable() {
  const { t } = useTranslation()
  const columns = [
    t('name'),
    t('email'),
    t('speciality'),
    t('status'),
    t('review'),
  ]

  const { getMyEmployees } = useClinic()
  const { data, isLoading: loading } = useQuery({
    queryKey: ['employees'],
    queryFn: getMyEmployees,
  })

  const rows = loading ? TableLoadingRows() : EmployeesRowsValues(data ?? [])

  function TableLoadingRows(): Row[] {
    return [
      {
        key: '',
        values: [...Array(columns.length)].map(() => <Skeleton />),
      },
    ]
  }

  return <Table columns={columns} rows={rows} />
}

function EmployeesRowsValues(employees: Employee[]): Row[] {
  return employees.map((employee) => {
    const { fullName, email, specialty, status, score, image } = employee

    const values = [
      <Profile profile={fullName} image={image} />,
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
