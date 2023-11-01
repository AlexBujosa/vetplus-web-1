import Button from '@/components/button'
import Input from '@/components/input'
import ProfileImage from '@/components/profile-image'
import Select from '@/components/select'
import { Title, Body } from '@/components/typography'
import { useClinic } from '@/hooks/use-clinic'
import { Box, SelectChangeEvent, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import CustomTabPanel from '@/components/molecules/custom-tab-panel'
import { useQueryClient } from '@tanstack/react-query'
import { Employee } from '@/hooks/use-clinic/employeesAtom'

function EmployeeModal(props: { title: string }) {
  const { title } = props

  const { t } = useTranslation()
  const params = useParams()
  const { email: employeeEmail } = params

  const client = useQueryClient()

  const clinicEmployees: any[] | undefined = client.getQueryData(['employees'])

  if (!clinicEmployees) return null

  const employee: Employee = clinicEmployees.find(({ email }) => {
    return email === employeeEmail
  })

  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  if (!employee) return null

  const {
    names,
    surnames,
    email,
    address,
    telephoneNumber,
    specialty,
    status,
    image,
  } = employee

  return (
    <article className='bg-white px-[30px] py-[20px]'>
      <div className='flex flex-row items-center justify-between '>
        <Title.Small className='text-2xl' text={title} />
      </div>

      <div className='flex flex-col'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label={t('profile')} />
            <Tab label={t('professional')} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <Body.Large
            className='font-normal my-[20px]'
            text={t('profile-image')}
          />

          <div className='flex flex-row gap-x-[10px] items-center'>
            <ProfileImage src={image} className='w-[80px] h-[80px]' />

            <input type='file' />
          </div>

          <div className='grid grid-cols-2 grid-rows-auto mt-[60px] mb-[20px] gap-x-[50px] gap-y-[40px]'>
            <Input value={names} variant='outlined' label={t('name')} />
            <Input value={surnames} variant='outlined' label={t('surnames')} />
            <Input value={email} variant='outlined' label={t('email')} />
            <Input value={address} variant='outlined' label={t('address')} />
            <Input
              value={telephoneNumber}
              variant='outlined'
              label={t('telephone-number')}
            />
          </div>

          <Button className='self-end px-[30px]' label={t('save')} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <ProfessionalSection specialty={specialty} status={status} />
        </CustomTabPanel>
      </div>
    </article>
  )
}

function ProfessionalSection(props: { specialty: string; status: boolean }) {
  const { specialty, status } = props
  const { t } = useTranslation()

  const [statusValue, setStatusValue] = React.useState<string>(
    status as unknown as string
  )

  const [specialtyValue, setSpecialtyValue] = React.useState<string>(
    specialty as unknown as string
  )

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusValue(event.target.value as string)
  }

  const handleSpecialtyChange = (event: SelectChangeEvent) => {
    setSpecialtyValue(event.target.value as string)
  }

  return (
    <div className='grid grid-cols-2 grid-rows-auto mt-[60px] mb-[20px] gap-x-[50px] gap-y-[40px]'>
      <Select
        label={t('speciality')}
        value={specialtyValue}
        onChange={handleSpecialtyChange}
        options={[{ label: 'Cirugia', value: 'Cirugia' }]}
      />
      <Select
        label={t('status')}
        value={statusValue}
        onChange={handleStatusChange}
        options={[
          { label: 'True', value: 'true' },
          { label: 'False', value: 'false' },
        ]}
      />
    </div>
  )
}

export default EmployeeModal
