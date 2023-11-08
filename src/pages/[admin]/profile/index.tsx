import  { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/button'
import ProfileImage from '@/components/profile-image'
import StarsReview from '@/components/stars-review'
import StatusBadge from '@/components/status-badge'
import { Body, Headline, Title } from '@/components/typography'
import { PersonOutlined, Edit } from '@mui/icons-material'
import { Box, Modal } from '@mui/material'
import EmployeeModal from '@/components/molecules/employee-modal'
import { useAtom } from 'jotai'
import { userAtom } from '@/hooks/use-user/userAtom'
import { roleAtom } from '@/hooks/use-auth/roleAtom'
import { Role } from '@/types/role'

export default function ProfilePage() {
  return (
    <main className='flex flex-col gap-y-[60px]'>
      <Header />
      <GeneralDescription />
    </main>
  )
}

function Header() {
  const [user] = useAtom(userAtom)
  const [role] = useAtom(roleAtom)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { t } = useTranslation()

  if (!user) return null
  if (!role) return null

  const { names, surnames } = user
  const fullName = `${names} ${surnames}`

  return (
    <section className='flex flex-col gap-y-7'>
      <Headline.Medium text={fullName} />

      <div className='flex flex-row items-center justify-between gap-x-5'>
        <ProfileWithRole image={user.image} role={role} />

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

export function ProfileWithRole({
  image,
  role,
}: {
  image: string
  role: Role
}) {
  return (
    <div className='flex flex-row gap-x-[10px] items-center'>
      <ProfileImage
        className='w-[100px] h-[100px]'
        src={image}
        loading={!image}
      />

      <span className='flex flex-row gap-x-[6px] p-[10px] border border-base-neutral-gray-500 text-base-neutral-gray-800'>
        <PersonOutlined />
        <Body.Large text={role as string} />
      </span>
    </div>
  )
}

function GeneralDescription() {
  const employee = {
    email: 'Lauramejia@gmail.com',
    telephoneNumber: '402-74387672-12',
    address: 'Av. Núñez de Cáceres 593, Santo Domingo 10133',
    specialty: 'Cirugia',
    score: 4.5,
    status: true,
  }

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
  width: '40%',
}
