import {
  PropsWithChildren,
  useState,
  cloneElement,
  useCallback,
  Key,
} from 'react'
import Image from '@/components/image'
import { Body, Headline, Label, Title } from '@/components/typography'
import {
  Edit,
  HomeWorkOutlined,
  LocalShippingOutlined,
  LocationOnOutlined,
  MedicationOutlined,
  Star,
  CancelOutlined,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import Button from '@/components/button'
import { t } from 'i18next'
import cn from '@/utils/cn'
import {
  Modal as MuiModal,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  Stack,
} from '@mui/material'
import Modal from '@/components/molecules/modal'
import Input from '@/components/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UpdateClinicForm, useClinic } from '@/hooks/use-clinic'
import { Clinic } from '@/types/clinic'
import * as yup from 'yup'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { useDropzone } from 'react-dropzone'
import { isEqual } from 'lodash'
import {
  DatePicker,
  LocalizationProvider,
  TimeField,
} from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Badge } from '@/components/badge'

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
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
 
  return (
    <section className='flex w-full justify-between'>
      <div className='flex gap-x-[10px]'>
      <Image
        src={image}
        className='w-[350px] h-[200px] object-fill rounded-lg'
      />

      <article className='flex flex-col justify-start'>
        <Headline.Medium className='text-black mb-3' text={name} />

        <div className='text-base-neutral-gray-800'>
          <div className='flex gap-x-1 items-center'>
          <LocationOnOutlined />
          <Title.Small text={address} />
          </div>
          
        <div className='flex gap-x-1 items-center'>  
          <Star className='text-base-orange-500' />
          <Label.Large
            text={String((total_points / total_users).toPrecision(2)) ?? '0'}
          />
          </div>
        
        </div>
      </article>
      </div>
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

  const { workingDays, nonWorkingDays } = schedule || {}

  const workingDaysString =
    workingDays && workingDays.length !== 0
      ? `Lunes a Viernes: ${workingDays[0]?.startTime} - ${workingDays[0]?.endTime}`
      : ''
  const nonWorkingDaysString = `No laborables: ${nonWorkingDays || ''}`
  const scheduleString = `${workingDaysString}\n${nonWorkingDaysString}`

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
            <div key={label} className='flex items-start gap-x-[20px]'>
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
      className='p-0 max-h-[400px] overflow-y-scroll'
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
  width: '70%',
}

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
  telephone_number: yup.string().required(),
  address: yup.string().required(),
})

function ProfileModalSection() {
  const { t } = useTranslation()

  const { getMyClinic, updateClinic, clinicServices } = useClinic()

  const { data } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: updateClinic,
  })

  const { saveClinicImage } = useClinic()

  const { mutateAsync: mutateImageAsync, isPending: isLoadingImage } =
    useMutation({
      mutationFn: ({ picture }: { picture: Picture }) =>
        saveClinicImage(picture),
    })

  if (!data) return

  const { name, email, telephone_number, address } = data

  const [selectedServices, setSelectedServices] = useState<string[]>(
    data.services ?? []
  )

  const initialValues: UpdateClinicForm = {
    name,
    email,
    telephone_number,
    address,
    services: data.services,
  }

  const queryClient = useQueryClient()

  const onSubmit = async (data: UpdateClinicForm) => {
    try {
      if (picture) {
        await mutateImageAsync({ picture }),
          toast.success(`Image ${picture.name} - was saved succesfully`)
      }
    } catch (error) {
      toast.error('Something bad happened at saving the image.')
      console.error(error)
    }

    if (
      isEqual(formik.values, initialValues) &&
      isEqual(data.services, selectedServices)
    )
      return

    try {
      await mutateAsync({ ...data })

      console.log(formik.values.services)

      queryClient.invalidateQueries()
      toast.success(t('updated-fields'))
    } catch (error) {
      toast.error('Something bad happened at editing the data.')
      console.error(error)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit,
  })

  console.log({
    services: data.services,
    selectedServices,
    formik: formik.values.services,
  })

  type Picture = File & {
    path: Key
  }

  const [picture, setPicture] = useState<Picture | null>(null)

  const onDrop = useCallback(
    ([file]: any) => {
      setPicture(file)
    },
    [picture]
  )

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  })

  const removeFile = () => setPicture(null)

  const files = picture && (
    <li className='flex flex-row justify-between' key={picture.path}>
      {picture.name} - {picture.size} bytes{' '}
      <button
        className='px-2 py-1 text-white rounded-md bg-base-semantic-danger-500'
        onClick={removeFile}
      >
        {t('remove')}
      </button>
    </li>
  )

  return (
    <article className='py-5'>
      <Title.Large text={t('image')} />

      <div {...getRootProps({ className: 'dropzone' })}>
        <div
          className='flex flex-col items-center justify-center h-16 text-gray-500 border-2 border-gray-500 border-dashed bg-gray-50'
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? <p>{t('drop-here')}</p> : <p>{t('drag-and-drop')}</p>}
        </div>
      </div>

      {picture && (
        <aside className='mt-2'>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      )}

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

        <Select
          multiple
          value={selectedServices}
          onChange={(e) => {
            setSelectedServices(e.target.value)
            formik.setFieldValue('services', e.target.value)
          }}
          className='col-span-2'
          label={t('services')}
          name='services'
          input={<OutlinedInput label='Multiple Select' />}
          renderValue={(selected) => (
            <Stack gap={1} direction='row' flexWrap='wrap'>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => {
                    setSelectedServices(
                      selectedServices.filter((item) => item !== value)
                    )
                    formik.setFieldValue(
                      'services',
                      selectedServices.filter((item) => item !== value)
                    )
                  }}
                  deleteIcon={
                    <CancelOutlined
                      onMouseDown={(event) => event.stopPropagation()}
                    />
                  }
                />
              ))}
            </Stack>
          )}
        >
          {clinicServices.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>

        <Button
          type='submit'
          className='w-full col-span-2'
          label={t('edit')}
          loading={isLoading || isLoadingImage}
          disabled={
            isEqual(formik.values, initialValues) &&
            isEqual(data.services, selectedServices) &&
            !picture
          }
        />
      </form>
    </article>
  )
}

function ScheduleModalSection() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { getMyClinic, updateClinicSchedule } = useClinic()

  const { data: clinic } = useQuery({
    queryKey: ['clinic'],
    queryFn: getMyClinic,
  })

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: updateClinicSchedule,
  })

  if (!clinic) return null

  const onSubmit = async (values: {
    workingDays: { day: string; startTime: string; endTime: string }[]
    nonWorkingDays: string[]
  }) => {
    try {
      await mutateAsync(values)
      toast.success(t('updated-fields'))
      queryClient.invalidateQueries()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const [nonWorkingDays, setNonWorkingDays] = useState<string[]>(
    clinic.schedule?.nonWorkingDays ?? []
  )

  const initialValues = {
    workingDays:
      !clinic.schedule ||
      !clinic.schedule.workingDays ||
      clinic.schedule.workingDays.length === 0
        ? [
            { day: 'Monday', endTime: '17:00:00', startTime: '07:00:00' },
            { day: 'Tuesday', endTime: '17:00:00', startTime: '07:00:00' },
            { day: 'Wednesday', endTime: '17:00:00', startTime: '07:00:00' },
            { day: 'Thursday', endTime: '17:00:00', startTime: '07:00:00' },
            { day: 'Friday', endTime: '17:00:00', startTime: '07:00:00' },
            { day: 'Saturday', endTime: '12:00:00', startTime: '07:00:00' },
          ]
        : clinic.schedule.workingDays.map(({ day, startTime, endTime }) => ({
            day,
            startTime,
            endTime,
          })),
    nonWorkingDays: clinic.schedule?.nonWorkingDays ?? [],
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
  })

  return (
    <form onSubmit={formik.handleSubmit} className='grid grid-cols-2'>
      <section>
        <Typography variant='h6' gutterBottom>
          {t('working-days')}
        </Typography>

        <List>
          {formik.values.workingDays.map((day, index) => {
            return (
              <ListItem key={day.day}>
                <ListItemText className='w-8' primary={day.day} />

                <span className='flex gap-x-3'>
                  <input
                    className='p-2 border-2 border-base-primary-100'
                    value={formik.values.workingDays[index].startTime}
                    onChange={(event) => {
                      const { value } = event.target
                      formik.setFieldValue(
                        `workingDays[${index}].startTime`,
                        value
                      )
                    }}
                    type='time'
                  />

                  <input
                    className='p-2 border-2 border-base-primary-100'
                    value={formik.values.workingDays[index].endTime}
                    onChange={(event) => {
                      const { value } = event.target
                      formik.setFieldValue(
                        `workingDays[${index}].endTime`,
                        value
                      )
                    }}
                    type='time'
                  />
                </span>
              </ListItem>
            )
          })}
        </List>
      </section>

      <section>
        <Typography variant='h6' gutterBottom>
          {t('non-working-days')}
        </Typography>

        <List className='flex flex-col'>
          <section className='grid grid-cols-6 gap-2 w-100'>
            {nonWorkingDays.map((date: string) => (
              <Badge
                className='font-bold text-white cursor-pointer select-none bg-base-primary-500 hover:bg-base-primary-600'
                key={date}
                label={date}
                onClick={() => {
                  setNonWorkingDays((prevNonWorkingDays) =>
                    prevNonWorkingDays.filter((item) => item !== date)
                  )

                  formik.setFieldValue(
                    'nonWorkingDays',
                    nonWorkingDays.filter((item) => item !== date)
                  )
                }}
              />
            ))}
          </section>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                format='DD-MM-YYYY'
                onChange={(newDate) => {
                  if (!newDate) return

                  const date = newDate.format('YYYY-MM-DD')

                  if (nonWorkingDays.some((d) => d === date)) {
                    toast.error('The non working date already exists.')
                    return
                  }

                  setNonWorkingDays((prevNonWorkingDays) => [
                    ...prevNonWorkingDays,
                    date,
                  ])

                  formik.setFieldValue('nonWorkingDays', [
                    ...nonWorkingDays,
                    date,
                  ])
                }}
                componentsProps={{
                  actionBar: {
                    actions: ['clear'],
                  },
                }}
                minDate={dayjs()}
              />
            </DemoContainer>
          </LocalizationProvider>
        </List>
      </section>

      <Button
        type='submit'
        size='small'
        label={t('edit')}
        loading={isLoading}
        disabled={
          isEqual(formik.values, initialValues) &&
          isEqual(formik.values, clinic.schedule)
        }
      />
    </form>
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
