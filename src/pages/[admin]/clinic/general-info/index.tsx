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
import { Modal as MuiModal, Box } from '@mui/material'
import Modal from '@/components/molecules/modal'
import Input from '@/components/input'
import {
  LocalizationProvider,
  DateCalendar,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UpdateClinicForm, useClinic } from '@/hooks/use-clinic'
import { Clinic } from '@/types/clinic'
import * as yup from 'yup'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

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
  const { image, name, address, ClinicSummaryScore }: Clinic = data
  const { total_points, total_users } = ClinicSummaryScore

  return (
    <section className='flex flex-row gap-x-[10px]'>
      <Image src={image} className='w-1/5 rounded-lg' />

      <article className='flex flex-col justify-between'>
        <Headline.Medium className='text-black' text={name} />

        <div className='grid items-center grid-cols-6 grid-rows-2 text-base-neutral-gray-800'>
          <LocationOnOutlined />

          <Title.Small className='col-span-5' text={address} />

          <Star className='text-yellow-500' />

          <Label.Large
            className='col-span-5'
            text={String((total_points / total_users).toPrecision(2)) ?? '0'}
          />
        </div>
      </article>
    </section>
  )
}

function GeneralDescription() {
  const { t } = useTranslation()
  const { getMyClinic } = useClinic()

  const { data, isLoading } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  if (isLoading) return null

  // @ts-ignore
  const { email, telephone_number, schedule }: Clinic = data

  const scheduleString = `
    Lunes a Viernes: ${schedule.workingDays[0].startTime} - ${schedule.workingDays[0].endTime}\n No laborables: ${schedule.nonWorkingDays}`
  const values = [
    { label: t('email'), value: email ?? 'N/A' },
    { label: t('telephone-number'), value: telephone_number ?? 'N/A' },
    { label: t('schedule'), value: scheduleString ?? 'N/A' },
  ]

  return (
    <SectionCard className='col-span-2' title={t('general-description')}>
      <div className='grid grid-cols-2 grid-rows-auto gap-y-10 gap-x-32 px-[30px] py-[38px]'>
        {values.map(({ label, value }) => {
          return (
            <div key={label} className='flex items-center gap-x-[20px]'>
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

  const { data, isLoading } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  if (isLoading || !data) return null

  const { services }: Clinic = data

  const icons = [
    <HomeWorkOutlined />,
    <MedicationOutlined />,
    <LocalShippingOutlined />,
  ]

  return (
    <SectionCard title={t('services')}>
      <div className='grid grid-cols-2 gap-y-10 grid-rows-auto px-[30px] py-[38px]'>
        {services
          ? services.map((value, index) => {
              return (
                <Service
                  icon={icons[index] ?? <HomeWorkOutlined />}
                  name={value}
                />
              )
            })
          : 'No hay servicios en clinica'}
      </div>
    </SectionCard>
  )
}

function CommentsAndReview() {
  const { getMyClinicComments } = useClinic()

  const { data: comments } = useQuery({
    queryKey: ['comments'],
    queryFn: getMyClinicComments,
  })

  if (!comments) return null

  return (
    <SectionCard
      className='p-0 max-h-[300px] overflow-y-scroll'
      title={t('comments')}
    >
      {comments.map((comment: GetMyComment) => {
        return <Review key={comment.id} {...comment} />
      })}
    </SectionCard>
  )
}

function Review(props: GetMyComment) {
  const { Owner, comment, created_at } = props

  return (
    <div className='grid grid-cols-3 gap-x-28 px-5 py-[15px] border-b border-b-base-neutral-gray-500'>
      <section className='flex flex-row items-center gap-[10px]'>
        <Image src={Owner.image} className='rounded-full w-[55px] h-[55px]' />
        <Title.Small text={`${Owner.names} ${Owner.surnames ?? ''}`} />
      </section>

      <section className='flex flex-col justify-center'>
        {/* {score && <StarsReview review={score} />} */}
        <Body.Small className='text-black' text={comment} />
      </section>

      <section className='flex flex-col justify-center'>
        <Body.Small
          className='font-normal text-black'
          text={dayjs(created_at).format('LLL')}
        />
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

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
  telephone_number: yup.string().required(),
  address: yup.string().required(),
})

function ProfileModalSection() {
  const { t } = useTranslation()

  const { getMyClinic, updateClinic } = useClinic()

  const { data } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  if (!data) return

  const { name, email, telephone_number, address } = data

  const initialValues: UpdateClinicForm = {
    name,
    email,
    telephone_number,
    address,
  }

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: updateClinic,
  })

  const queryClient = useQueryClient()

  const onSubmit = async (data: UpdateClinicForm) => {
    await mutateAsync({ ...data })
    queryClient.invalidateQueries({ queryKey: ['clinic'] })
    toast.success(t('updated-fields'))
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit,
  })

  return (
    <article className='py-5'>
      <div className='flex flex-row items-center'>
        <Image className='w-40 rounded-lg' />
        <input type='file' name='' id='' />
      </div>

      <form
        className='grid grid-cols-2 py-12 gap-x-12 gap-y-10'
        onSubmit={formik.handleSubmit}
      >
        <Input
          variant='outlined'
          name='name'
          label={t('name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <Input
          variant='outlined'
          name='email'
          label={t('email')}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <Input
          variant='outlined'
          name='telephone-number'
          label={t('telephone-number')}
          value={formik.values.telephone_number}
          onChange={formik.handleChange}
          error={
            formik.touched.telephone_number &&
            Boolean(formik.errors.telephone_number)
          }
          helperText={
            formik.touched.telephone_number && formik.errors.telephone_number
          }
        />

        <Input
          variant='outlined'
          name='address'
          label={t('address')}
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />

        <Button
          type='submit'
          className='w-full col-span-2'
          label={t('edit')}
          loading={isLoading}
        />
      </form>
    </article>
  )
}

function ScheduleModalSection() {
  const { t } = useTranslation()
  // const [, setDayFrom] = useState<string>()
  // const [dayUntil, setDayUntil] = useState<string>()

  // const handleDayFromChange = (event: SelectChangeEvent) => {
  //   setDayFrom(event.target.value as string)
  // }

  // const handleDayUntilChange = (event: SelectChangeEvent) => {
  //   setDayUntil(event.target.value as string)
  // }

  // const days = [
  //   {
  //     label: t('monday'),
  //   },
  //   {
  //     label: t('tuesday'),
  //   },
  //   {
  //     label: t('wednesday'),
  //   },
  //   {
  //     label: t('thursday'),
  //   },
  //   {
  //     label: t('friday'),
  //   },
  //   {
  //     label: t('friday'),
  //   },
  //   {
  //     label: t('saturday'),
  //   },
  //   {
  //     label: t('sunday'),
  //   },
  // ]

  return (
    <article className='grid grid-cols-2'>
      <div className='grid grid-cols-2'>
        <Body.Large text={t('days')} className='col-span-2' />
        {/* <Select value={dayFrom} onChange={handleDayFromChange} options={days} /> */}
        {/* <Select
          value={dayUntil}
          // onChange={handleDayUntilChange}
          options={days}
        /> */}

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

interface GetMyComment {
  id: string
  id_clinic: string
  id_owner: string
  comment: string
  created_at: Date
  updated_at: Date
  status: boolean
  Owner: Owner
}

interface Owner {
  names: string
  surnames: string
  image: string
}
