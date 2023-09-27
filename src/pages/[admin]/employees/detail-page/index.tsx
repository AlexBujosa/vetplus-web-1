import Button from '@/components/button'
import StarsReview from '@/components/stars-review'
import StatusBadge from '@/components/status-badge'
import { Body, Headline, Title } from '@/components/typography'
import { useClinic } from '@/hooks/use-clinic'
import { Employee } from '@/hooks/use-clinic/employeesAtom'
import { KeyboardBackspace, PersonOutlined, Edit } from '@mui/icons-material'
import { Box, IconButton, Modal } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

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
            <EditEmployeeModal />
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
      <img
        className='w-[100px] h-[100px] rounded-full'
        src={image || '/images/placeholder.png'}
      />

      <span className='flex flex-row gap-x-[6px] p-[10px] border border-base-neutral-gray-500 text-base-neutral-gray-800'>
        <PersonOutlined />
        <Body.Large text={t('employee')} />
      </span>
    </div>
  )
}

function EditEmployeeModal() {
  const { t } = useTranslation()
  return (
    <article className='bg-white'>
      <div className='flex flex-row items-center justify-between px-[30px]'>
        <Title.Small className='text-2xl' text={t('edit-employee')} />
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}
