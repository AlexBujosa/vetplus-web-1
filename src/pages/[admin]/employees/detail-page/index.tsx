import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/button'
import Input from '@/components/input'
import ProfileImage from '@/components/profile-image'
import Select from '@/components/select'
import StarsReview from '@/components/stars-review'
import StatusBadge from '@/components/status-badge'
import { Body, Headline, Title } from '@/components/typography'
import { useClinic } from '@/hooks/use-clinic'
import { Employee } from '@/hooks/use-clinic/employeesAtom'
import { KeyboardBackspace, PersonOutlined, Edit } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Modal,
  SelectChangeEvent,
  Tab,
  Tabs,
} from '@mui/material'

export default function EmployeesDetailPage() {
  const params = useParams()
  const { email } = params
  const { findEmployeeByEmail } = useClinic()
  const selectedEmployee = findEmployeeByEmail(email!)

  if (!selectedEmployee) return null

  return (
    <main className='flex flex-col gap-y-[60px]'>
      <EmployeeHeader employee={selectedEmployee} />
      <GeneralDescription employee={selectedEmployee} />
    </main>
  )
}

function EmployeeHeader({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <section className='flex flex-col gap-y-7'>
      <div className='flex flex-row gap-x-[20px]'>
        <IconButton
          onClick={() => navigate('/employees')}
          children={<KeyboardBackspace className='text-black' />}
        />
        <Headline.Medium text={employee.fullName} />
      </div>

      <div className='flex flex-row items-center justify-between gap-x-5'>
        <ProfileWithRole image={employee.image} />

        <Button
          onClick={handleOpen}
          size='small'
          icon={<Edit />}
          label={t('edit')}
        />

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <EmployeeModal title={t('edit-employee')} />
          </Box>
        </Modal>
      </div>
    </section>
  )
}

function ProfileWithRole({ image }: { image: string }) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-row gap-x-[10px] items-center'>
      <ProfileImage
        className='w-[100px] h-[100px]'
        src={image}
        loading={!image}
      />

      <span className='flex flex-row gap-x-[6px] p-[10px] border border-base-neutral-gray-500 text-base-neutral-gray-800'>
        <PersonOutlined />
        <Body.Large text={t('employee')} />
      </span>
    </div>
  )
}

function EmployeeModal(props: { title: string }) {
  const { title } = props

  const { t } = useTranslation()
  const params = useParams()
  const { email: employeeEmail } = params
  const { findEmployeeByEmail } = useClinic()
  const employee = findEmployeeByEmail(employeeEmail!)

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
            <ProfileImage className='w-[80px] h-[80px]' />

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

function GeneralDescription({ employee }: { employee: Employee }) {
  const { email, telephoneNumber, address, specialty, score, status } = employee
  const { t } = useTranslation()

  const data: Record<string, JSX.Element> = {
    [t('email')]: <Typography text={email} />,
    [t('telephone-number')]: <Typography text={telephoneNumber} />,
    [t('address')]: <Typography text={address} />,
    [t('speciality')]: <Typography text={specialty} />,
    [t('review')]: <StarsReview review={score} />,
    [t('status')]: <StatusBadge status={status} />,
  }

  return (
    <section className='shadow-elevation-1'>
      <div className='px-[30px] py-[15px] border border-b-base-neutral-gray-500'>
        <Title.Medium
          className='font-semibold'
          text={t('general-description')}
        />
      </div>

      <div className='grid grid-cols-2 grid-rows-3 p-[30px]'>
        {Object.keys(data).map((key) => (
          <div className='flex flex-row items-center gap-x-[30px]' key={key}>
            <Body.Large className='text-black' text={key} />

            {data[key]}
          </div>
        ))}
      </div>
    </section>
  )
}

function Typography(props: { text?: string }) {
  const { text } = props

  return (
    <Body.Medium
      className='font-normal text-base-neutral-gray-800'
      text={text || 'N/A'}
    />
  )
}

interface TabPanelProps extends React.PropsWithChildren {
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
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
