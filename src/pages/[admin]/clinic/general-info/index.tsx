import React, { PropsWithChildren } from 'react'
import Image from '@/components/image'
import { Body, Headline, Label, Title } from '@/components/typography'
import {
  Edit,
  HomeWorkOutlined,
  LocalShippingOutlined,
  LocationOnOutlined,
  MasksOutlined,
  MedicationOutlined,
  Star,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import Button from '@/components/button'
import { t } from 'i18next'
import cn from '@/utils/cn'
import StarsReview from '@/components/stars-review'
import { Modal as MuiModal, Box } from '@mui/material'
import Modal from '@/components/molecules/modal'

export default function GeneralViewPage() {
  const { t } = useTranslation()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <ClinicHeader />
      <Button
        onClick={handleOpen}
        className='self-end'
        icon={<Edit />}
        label={t('edit')}
      />

      <MuiModal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Modal title={t('edit-clinic')} />
        </Box>
      </MuiModal>

      <section className='grid grid-cols-3 grid-rows-1 gap-x-8'>
        <GeneralDescription />

        <ClinicServices />
      </section>
      <CommentsAndReview />
    </>
  )
}

function ClinicHeader() {
  const { t } = useTranslation()

  return (
    <section className='flex flex-row gap-x-[10px]'>
      <Image className='w-1/5 rounded-lg' />

      <article className='flex flex-col justify-between'>
        <Headline.Medium className='text-black' text={t('veterinary-clinic')} />

        <div className='grid items-center grid-cols-6 grid-rows-2 text-base-neutral-gray-800'>
          <LocationOnOutlined />

          <Title.Small className='col-span-5' text='AV. Lopez de vega' />

          <Star className='text-yellow-500' />

          <Label.Large className='col-span-5' text='4.5' />
        </div>
      </article>
    </section>
  )
}

function GeneralDescription() {
  const { t } = useTranslation()

  const labels = [t('email'), t('telephone-number'), t('schedule')]

  return (
    <SectionCard className='col-span-2' title={t('general-description')}>
      <div className='grid grid-cols-2 grid-rows-auto gap-y-10 gap-x-32 px-[30px] py-[38px]'>
        {labels.map((value) => {
          return (
            <div className='flex items-center gap-x-[20px]'>
              <Title.Small className='text-black' text={value} />
              <Body.Medium
                className='text-base-neutral-gray-800'
                text='dasnsada'
              />
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

function ClinicServices() {
  const services = {
    consultation: {
      label: t('consultation'),
      icon: <HomeWorkOutlined />,
    },
    surgery: { label: t('surgery'), icon: <MasksOutlined /> },
    'preventive-medicine': {
      label: t('preventive-medicine'),
      icon: <MedicationOutlined />,
    },
    delivery: {
      label: t('delivery'),
      icon: <LocalShippingOutlined />,
    },
  }

  return (
    <SectionCard title={t('services')}>
      <div className='grid grid-cols-2 gap-y-10 grid-rows-auto px-[30px] py-[38px]'>
        {Object.entries(services).map(([key, value]) => {
          const { label, icon } = value

          return <Service icon={icon} name={label} />
        })}
      </div>
    </SectionCard>
  )
}

function CommentsAndReview() {
  const reviews = [
    {
      name: 'Juan Perez',
      veterinarian: 'Laura Mejia',
      score: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec velit nec.',
      kind: 'Cita',
      date: '12 de agosto, 3:00 PM',
    },
    {
      name: 'Juan Perez',
      veterinarian: 'Laura Mejia',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec velit nec.',
      kind: 'Cita',
      date: '12 de agosto, 3:00 PM',
    },
    {
      name: 'Juan Perez',
      veterinarian: 'Laura Mejia',
      score: 4.5,
      kind: 'Cita',
      date: '12 de agosto, 3:00 PM',
    },
  ]
  return (
    <SectionCard className='p-0' title={t('comments-reviews')}>
      {reviews.map((review) => {
        return <Review {...review} />
      })}
    </SectionCard>
  )
}

function Review(props: {
  name: string
  veterinarian: string
  score?: number
  kind: string
  date: string
  review?: string
}) {
  const { name, veterinarian, score, review, date } = props

  return (
    <div className='grid grid-cols-4 gap-x-28 px-5 py-[15px] border-b border-b-base-neutral-gray-500'>
      <section className='flex flex-row items-center gap-[10px]'>
        <Image className='rounded-full w-[55px] h-[55px]' />
        <Title.Small text={name} />
      </section>

      <section className='flex flex-col justify-center'>
        <Title.Small text={t('veterinary')} />
        <Body.Small text={veterinarian} />
      </section>

      <section className='flex flex-col justify-center'>
        {score && <StarsReview review={score} />}
        {review && <Body.Small className='text-black' text={review} />}
      </section>

      <section className='flex flex-col justify-center'>
        <Title.Small text={t('appointment')} />
        <Body.Small className='font-normal text-black' text={date} />
      </section>
    </div>
  )
}

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: JSX.Element
}

function IconWithBackground(props: IconProps) {
  const { icon } = props

  return (
    <div className='flex items-center justify-center rounded-full w-11 h-11 bg-base-neutral-gray-500'>
      {React.cloneElement(icon, { width: 20, height: 20 })}
    </div>
  )
}

interface ServiceProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: JSX.Element
  name: string
}

function Service(props: ServiceProps) {
  const { icon, name } = props

  return (
    <div className='flex flex-row items-center gap-x-[10px]'>
      <IconWithBackground icon={icon} />

      <Body.Medium
        className='font-normal text-base-neutral-gray-800'
        text={name}
      />
    </div>
  )
}

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    PropsWithChildren {
  title: string
}

function SectionCard(props: CardProps) {
  const { title, children, className } = props

  return (
    <article
      className={cn('grid bg-white rounded-lg shadow-elevation-1', className)}
    >
      <div className='px-[30px] py-[15px] border-b border-b-neutral-gray-500 h-fit'>
        <Title.Medium className='text-black' text={title} />
      </div>

      {children}
    </article>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
}
