import { PropsWithChildren, useState, cloneElement } from 'react'
import Image from '@/components/image'
import { Body, Headline, Label, Title } from '@/components/typography'
import {
  Edit,
  HomeWorkOutlined,
  LocalShippingOutlined,
  LocationOnOutlined,
  MedicationOutlined,
  Star,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import Button from '@/components/button'
import { t } from 'i18next'
import cn from '@/utils/cn'
import StarsReview from '@/components/stars-review'
import { Modal as MuiModal, Box, SelectChangeEvent } from '@mui/material'
import Modal from '@/components/molecules/modal'
import Input from '@/components/input'
import Select from '@/components/select'
import {
  LocalizationProvider,
  DateCalendar,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useQuery } from '@tanstack/react-query'
import { useClinic } from '@/hooks/use-clinic'
import { Clinic } from '@/types/clinic'

export default function GeneralViewPage() {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
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
          <Modal
            title={t('edit-clinic')}
            tabs={[t('profile'), t('schedule')]}
            sections={[<ProfileModalSection />, <ScheduleModalSection />]}
          />
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

  const { getMyClinic } = useClinic()

  const { data, isLoading } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  if (isLoading)
    return (
      <section className='flex flex-row gap-x-[10px] animate-pulse'>
        <Image className='w-1/5 rounded-lg' />

        <article className='flex flex-col justify-between'>
          <Headline.Medium
            className='text-black'
            text={t('veterinary-clinic')}
          />

          <div className='grid items-center grid-cols-6 grid-rows-2 text-base-neutral-gray-800'>
            <LocationOnOutlined />

            <Title.Small className='col-span-5' text={t('address')} />

            <Star className='text-yellow-500' />

            <Label.Large className='col-span-5' text='1.2' />
          </div>
        </article>
      </section>
    )

  // @ts-ignore
  const { name, address, ClinicSummaryScore }: Clinic = data.getMyClinic
  const { total_points, total_users } = ClinicSummaryScore

  return (
    <section className='flex flex-row gap-x-[10px]'>
      <Image className='w-1/5 rounded-lg' />

      <article className='flex flex-col justify-between'>
        <Headline.Medium className='text-black' text={name} />

        <div className='grid items-center grid-cols-6 grid-rows-2 text-base-neutral-gray-800'>
          <LocationOnOutlined />

          <Title.Small className='col-span-5' text={address} />

          <Star className='text-yellow-500' />

          <Label.Large
            className='col-span-5'
            text={String(total_points / total_users)}
          />
        </div>
      </article>
    </section>
  )
}

function GeneralDescription() {
  const { t } = useTranslation()
  const { getMyClinic } = useClinic()

  const { data } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  // @ts-ignore
  const { email, telephone_number, schedule }: Clinic = data.getMyClinic

  const scheduleString = `
    Lunes a Viernes: ${schedule.workingDays[0].startTime} - ${schedule.workingDays[0].endTime}\n No laborables: ${schedule.nonWorkingDays}`
  const values = [
    { label: t('email'), value: email },
    { label: t('telephone-number'), value: telephone_number },
    { label: t('schedule'), value: scheduleString },
  ]

  return (
    <SectionCard className='col-span-2' title={t('general-description')}>
      <div className='grid grid-cols-2 grid-rows-auto gap-y-10 gap-x-32 px-[30px] py-[38px]'>
        {values.map(({ label, value }) => {
          return (
            <div className='flex items-center gap-x-[20px]'>
              <Title.Small className='text-black' text={label} />
              <Body.Medium
                className='text-base-neutral-gray-800'
                text={value ?? 'N/A'}
              />
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

function ClinicServices() {
  const { getMyClinic } = useClinic()

  const { data } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  // @ts-ignore
  const { services }: Clinic = data.getMyClinic

  // const services = {
  //   consultation: {
  //     label: t('consultation'),
  //     icon: <HomeWorkOutlined />,
  //   },
  //   surgery: { label: t('surgery'), icon: <MasksOutlined /> },
  //   'preventive-medicine': {
  //     label: t('preventive-medicine'),
  //     icon: <MedicationOutlined />,
  //   },
  //   delivery: {
  //     label: t('delivery'),
  //     icon: <LocalShippingOutlined />,
  //   },
  // }

  const icons = [
    <HomeWorkOutlined />,
    <MedicationOutlined />,
    <LocalShippingOutlined />,
  ]

  return (
    <SectionCard title={t('services')}>
      <div className='grid grid-cols-2 gap-y-10 grid-rows-auto px-[30px] py-[38px]'>
        {services.map((value, index) => {
          return (
            <Service icon={icons[index] ?? <HomeWorkOutlined />} name={value} />
          )
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
      {cloneElement(icon, { width: 20, height: 20 })}
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

function ProfileModalSection() {
  const { t } = useTranslation()

  const [select, setSelectValue] = useState<string>()

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value as string)
  }

  return (
    <article className='py-5'>
      <div className='flex flex-row items-center'>
        <Image className='w-40 rounded-lg' />
        <input type='file' name='' id='' />
      </div>

      <form className='grid grid-cols-3 py-12 gap-x-12 gap-y-10'>
        <Input variant='outlined' name={t('name')} label={t('name')} />
        <Input variant='outlined' name={t('email')} label={t('email')} />
        {/* <Input variant='outlined' name={t('name')} /> */}
        <Input
          variant='outlined'
          name={t('telephone-number')}
          label={t('telephone-number')}
        />
        {/* <Input variant='outlined' name={t('rnc')} /> */}
        {/* <Input variant='outlined' name={t('name')} /> */}
        <Input variant='outlined' name={t('address')} label={t('address')} />
        <Input
          className='col-span-2'
          variant='outlined'
          name={t('services')}
          label={t('services')}
        />

        <Select
          value={select}
          onChange={handleStatusChange}
          options={[{ label: 'Manual', value: 'Manual' }]}
        />

        <Button
          onClick={() => {
            return
          }}
          size='small'
          label={t('save')}
        />
      </form>
    </article>
  )
}

function ScheduleModalSection() {
  const { t } = useTranslation()
  const [dayFrom, setDayFrom] = useState<string>()
  const [dayUntil, setDayUntil] = useState<string>()

  const handleDayFromChange = (event: SelectChangeEvent) => {
    setDayFrom(event.target.value as string)
  }

  const handleDayUntilChange = (event: SelectChangeEvent) => {
    setDayUntil(event.target.value as string)
  }

  const days = [
    {
      label: t('monday'),
    },
    {
      label: t('tuesday'),
    },
    {
      label: t('wednesday'),
    },
    {
      label: t('thursday'),
    },
    {
      label: t('friday'),
    },
    {
      label: t('friday'),
    },
    {
      label: t('saturday'),
    },
    {
      label: t('sunday'),
    },
  ]

  return (
    <article className='grid grid-cols-2'>
      <div className='grid grid-cols-2'>
        <Body.Large text={t('days')} className='col-span-2' />
        <Select value={dayFrom} onChange={handleDayFromChange} options={days} />
        <Select
          value={dayUntil}
          onChange={handleDayUntilChange}
          options={days}
        />

        <Body.Large text={t('hour')} className='col-span-2' />

        {/* <Input variant='outlined' name={t('hour')} label={t('hour')} />
        <Input variant='outlined' name={t('hour')} label={t('hour')} /> */}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker />
          <TimePicker />
        </LocalizationProvider>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
      </LocalizationProvider>
    </article>
  )
}
