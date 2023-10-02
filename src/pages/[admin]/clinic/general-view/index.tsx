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

export default function GeneralViewPage() {
  return (
    <>
      <ClinicHeader />

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
      <Image className='h-40 rounded-lg w-72' />

      <article className='flex flex-col justify-between'>
        <Headline.Medium className='text-black' text={t('veterinary-clinic')} />

        <div className='grid items-center grid-cols-6 grid-rows-2 text-base-neutral-gray-800'>
          <LocationOnOutlined />

          <Title.Small className='col-span-5' text='AV. Lopez de vega' />

          <Star className='text-yellow-500' />

          <Label.Large className='col-span-5' text='4.5' />
        </div>

        <Button className='self-end' icon={<Edit />} label={t('edit')} />
      </article>
    </section>
  )
}

function GeneralDescription() {
  const { t } = useTranslation()

  const labels = [
    t('email'),
    t('telephone-number'),
    t('lic-centro-veterinario'),
    t('rnc'),
    t('schedule'),
  ]

  return (
    <SectionCard className='col-span-2' title={t('general-description')}>
      <div className='grid grid-cols-2 grid-rows-auto'>
        {labels.map((value) => {
          return (
            <div className='flex items-center gap-x-[20px]'>
              <Body.Large className='text-black' text={value} />
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
      <div className='grid grid-cols-2 gap-y-10 grid-rows-auto'>
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
      score: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec velit nec.',
      kind: 'Cita',
      date: '12 de agosto, 3:00 PM',
    },
    {
      name: 'Juan Perez',
      veterinarian: 'Laura Mejia',
      score: 4.5,
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec velit nec.',
      kind: 'Cita',
      date: '12 de agosto, 3:00 PM',
    },
  ]
  return (
    <SectionCard title={t('comments-reviews')}>
      {reviews.map((review) => {
        return <Review {...review} />
      })}
    </SectionCard>
  )
}

function Review(props: {
  name: string
  veterinarian: string
  score: number
  kind: string
  date: string
  review: string
}) {
  const { name, veterinarian, score, review, date } = props

  return (
    <div className='grid grid-cols-4'>
      <section className='flex flex-row gap-[10px]'>
        <Image className='rounded-full w-[55px] h-[55px]' />
        <Title.Small text={name} />
      </section>

      <section className='flex flex-col'>
        <Title.Small text={t('veterinary')} />
        <Body.Small text={veterinarian} />
      </section>

      <section className='flex flex-col'>
        <StarsReview review={score} />
        <Body.Small className='text-black' text={review} />
      </section>

      <section className='flex flex-col'>
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

      <div className='px-[30px] py-[38px]'>{children}</div>
    </article>
  )
}
