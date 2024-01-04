import { Body, Title } from '@/components/typography'
import { Box, Modal as MuiModal, Tab, Tabs, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomTabPanel from '@/components/molecules/custom-tab-panel'
import { Profile } from '@/components/profile'
import { Badge } from '@/components/badge'
import { Check, Close, EventOutlined } from '@mui/icons-material'
import Modal from '@/components/molecules/modal'
import Button from '@/components/button'
import Select from '@/components/select'
import Image from '@/components/image'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useClinic } from '@/hooks/use-clinic'
import { AppointmentStatus, type Appointment } from '@/types/clinic'
import dayjs, { Dayjs } from 'dayjs'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useAtom } from 'jotai'
import { queueAtom } from '@/hooks/use-queue/queueAtom'

interface SearchFilters {
  nameFilter?: string
  dateFilter?: Dayjs | null
}

export default function QueuePage() {
  const { t } = useTranslation()
  const [nameFilter, setNameFilter] = useState('')
  const [dateFilter, setDateFilter] = useState<Dayjs | null>()

  const handleNameFilterChange = (event: any) => {
    setNameFilter(event.target.value)
  }

  return (
    <>
      <Title.Large text={t('notifications')} />

      <article className='flex items-center gap-x-4'>
        <TextField
          sx={{ mt: 1 }}
          className='w-[300px]'
          placeholder={t('pet-name')}
          variant='outlined'
          value={nameFilter}
          onChange={handleNameFilterChange}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label={t('appointment-date')}
              value={dateFilter}
              onChange={(newDate) => setDateFilter(newDate)}
              componentsProps={{
                actionBar: {
                  actions: ['clear'],
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </article>

      <Card nameFilter={nameFilter} dateFilter={dateFilter} />
    </>
  )
}

function Card(props: SearchFilters) {
  const { t } = useTranslation()

  const [value, setValue] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const sections = [
    <PendingAppointments {...props} />,
    <VerifiedAppointments {...props} />,
  ]

  return (
    <article className='bg-white shadow-elevation-1'>
      <section>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={t('pending')} />
          <Tab label={t('verified')} />
        </Tabs>
      </section>

      {sections.map((section, index) => {
        return (
          <CustomTabPanel value={value} index={index}>
            {section}
          </CustomTabPanel>
        )
      })}
    </article>
  )
}

function VerifiedAppointments(props: SearchFilters) {
  const { nameFilter, dateFilter } = props
  const { getVerifiedAppointments } = useClinic()

  const { data: verifiedAppointments } = useQuery({
    queryKey: ['verified-appointments'],
    queryFn: getVerifiedAppointments,
  })

  if (!verifiedAppointments || verifiedAppointments.length === 0)
    return (
      <>
        <Body.Medium
          className='text-base-neutral-gray-700'
          text='No appointments to show'
        />
      </>
    )

  // Filter appointments based on name and date if filters are provided
  const filteredAppointments = verifiedAppointments
    .filter((appointment) => {
      const isNameMatch =
        !nameFilter ||
        appointment.Pet.name.toLowerCase().includes(nameFilter.toLowerCase())
      const isDateMatch =
        !dateFilter || dayjs(appointment.start_at).isSame(dateFilter, 'day')
      return isNameMatch && isDateMatch
    })
    .sort((a, b) => dayjs(b.start_at).valueOf() - dayjs(a.start_at).valueOf())
    .filter(({ appointment_status }) => {
      return appointment_status === AppointmentStatus.ACCEPTED
    })

  return (
    <article className='overflow-y-scroll max-h-[600px]'>
      {filteredAppointments.map((appointment, index) => {
        return <Notification key={index} appointment={appointment} />
      })}
    </article>
  )
}

function PendingAppointments(props: SearchFilters) {
  const { nameFilter, dateFilter } = props

  const { getPendingAppointments } = useClinic()

  const { data: pendingAppointments } = useQuery({
    queryKey: ['pending-appointments'],
    queryFn: getPendingAppointments,
  })

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>()
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = (appointment: Appointment) => {
    setOpen(true)
    setSelectedAppointment(appointment)
  }
  const handleClose = () => setOpen(false)

  if (!pendingAppointments || pendingAppointments.length === 0)
    return (
      <>
        <Body.Medium
          className='text-base-neutral-gray-700'
          text='No appointments to show'
        />
      </>
    )

  let filteredAppointments = pendingAppointments
    .filter((appointment) => {
      const isNameMatch =
        !nameFilter ||
        appointment.Pet.name.toLowerCase().includes(nameFilter.toLowerCase())
      const isDateMatch =
        !dateFilter || dayjs(appointment.start_at).isSame(dateFilter, 'day')
      return isNameMatch && isDateMatch
    })
    .sort((a, b) => dayjs(b.start_at).valueOf() - dayjs(a.start_at).valueOf())
    .filter(({ appointment_status }) => {
      return appointment_status !== AppointmentStatus.ACCEPTED
    })

  return (
    <div className='overflow-y-scroll max-h-[600px]'>
      {filteredAppointments.map((appointment, index) => {
        return (
          <Notification
            key={index}
            appointment={appointment}
            onClick={() => handleOpen(appointment)}
          />
        )
      })}

      <NotificationModal
        open={open}
        handleClose={handleClose}
        appointment={selectedAppointment}
        setAppointment={setSelectedAppointment}
      />
    </div>
  )
}

interface AppointmentProps extends React.HTMLAttributes<HTMLDivElement> {
  appointment: Appointment
}

function Notification(props: AppointmentProps) {
  const { onClick, appointment } = props
  const { created_at, Pet, start_at } = appointment

  return (
    <div
      className='flex flex-row items-center justify-between px-2 py-5 border-b rounded-lg cursor-pointer border-b-base-neutral-gray-500 hover:bg-base-neutral-gray-400'
      onClick={onClick}
    >
      <aside className='flex flex-row items-center gap-x-[30px]'>
        <Profile className='text-black' image={Pet.image} profile={Pet.name} />

        <Badge
          className='bg-base-primary-50 text-base-primary-700'
          label={Pet.gender}
        />
        <NotificationDatetime datetime={start_at} />
      </aside>

      <Body.Medium
        className='text-base-neutral-gray-700'
        text={dayjs(created_at).format('DD-MM-YYYY HH:MM A')}
      />
    </div>
  )
}

function NotificationDatetime(props: { datetime: Date }) {
  const { datetime } = props
  const ICON_SIZE = 20

  const iconStyles = { width: ICON_SIZE, height: ICON_SIZE }
  const date = dayjs(datetime).add(4, 'hours').format('LLLL')

  return (
    <span className='flex flex-row gap-x-[10px] items-center'>
      <EventOutlined
        style={iconStyles}
        className='text-base-neutral-gray-700'
      />
      <Body.Medium text={date} />
    </span>
  )
}

interface NotificationModalProps {
  appointment: Appointment | undefined
  open: boolean
  handleClose: () => void
  setAppointment: (prop?: Appointment) => void
}

function NotificationModal(props: NotificationModalProps) {
  const { open, handleClose, appointment, setAppointment } = props
  const { t } = useTranslation()

  const { getMyEmployeesForSelect, respondToAppointment } = useClinic()
  const employees = getMyEmployeesForSelect()

  const { mutateAsync } = useMutation({
    mutationFn: ({
      appointmentStatus,
      veterinarianId,
    }: {
      appointmentStatus: AppointmentStatus
      veterinarianId: string
    }) => {
      return respondToAppointment(
        appointment?.id as string,
        veterinarianId,
        appointmentStatus
      )
    },
  })

  const queryClient = useQueryClient()

  const onSubmit = async ({ status }: { status: AppointmentStatus }) => {
    if (status === AppointmentStatus.ACCEPTED && veterinarianId === '') {
      toast.error(t('required-veterinarian'))
      return
    }

    try {
      await mutateAsync({
        appointmentStatus: status,
        veterinarianId,
      })

      setVeterinarianId('')

      // @ts-ignore
      setAppointment((prevAppointment) => {
        return {
          ...prevAppointment,
          appointment_status: status,
        }
      })

      queryClient.invalidateQueries()

      if (status === AppointmentStatus.ACCEPTED) {
        toast.success(t('succesfull-appointment'))
      } else {
        toast.success(t('succesfull-denied-appointment'))
      }

      handleClose()
    } catch (error) {
      toast.error(t('something-wrong'))
    }
  }

  const [veterinarianId, setVeterinarianId] = useAtom(
    queueAtom(appointment?.Veterinarian.id ?? '')
  )

  const formik = useFormik({
    initialValues: {
      status: AppointmentStatus.DENIED,
      veterinarianId,
    },
    onSubmit,
  })

  const handleSelectChange = (e: any) => {
    setVeterinarianId(e.target.value)
    formik.setFieldValue('veterinarianId', e.target?.value)
  }

  // TODO: FIX, on cancell appointment make the veterinarian field as not required.

  if (!appointment || !employees) return null

  return (
    <MuiModal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Modal title={t('appointment')}>
          <form
            className='flex flex-col justify-between'
            onSubmit={formik.handleSubmit}
          >
            <div className='grid grid-cols-8 mt-5 mb-10 gap-y-10'>
              <span className='flex flex-col col-span-3 gap-y-[10px]'>
                <Body.Large text={t('pet-owner')} />

                <div className='flex flex-row items-center gap-x-5'>
                  <Image
                    src={appointment.Owner?.image ?? ''}
                    className='rounded-full h-[50px] w-[50px]'
                  />

                  <Body.Medium
                    text={`${appointment.Owner.names ?? ''} ${
                      appointment.Owner.surnames ?? ''
                    }`}
                  />
                </div>
              </span>
              <span className='flex flex-col col-span-5 gap-y-[10px]'>
                <Body.Large text={t('pet')} />

                <div className='flex flex-row items-center gap-x-5'>
                  <Image
                    src={appointment.Pet.image}
                    className='rounded-full h-[50px] w-[50px]'
                  />
                  <Body.Medium text={appointment.Pet.name} />
                </div>
              </span>

              <span className='col-span-3'>
                <Select
                  className='w-[250px]'
                  name='veterinarianId'
                  value={veterinarianId}
                  onChange={(e) => handleSelectChange(e)}
                  label={t('veterinary')}
                  options={employees}
                />
              </span>
              <span className='col-span-3'>
                <Body.Large text={t('appointment')} />

                <Body.Medium
                  className='text-base-neutral-gray-800'
                  text={dayjs(appointment.start_at)
                    .add(4, 'hours')
                    .format('LL')}
                />
              </span>
              <span className='col-span-2'>
                <Body.Large text={t('time')} />

                <Body.Medium
                  className='text-base-neutral-gray-800'
                  text={dayjs(appointment.start_at)
                    .add(4, 'hours')
                    .format('hh:mm A')}
                />

                {appointment.end_at && (
                  <Body.Medium
                    className='text-base-neutral-gray-800'
                    text={dayjs(appointment.end_at)
                      .add(4, 'hours')
                      .format('hh:mm A')}
                  />
                )}
              </span>
              {/* <Button icon={<Check />} label={t('accept')} />
                <Button icon={<Close />} label={t('deny')} />
                <Button label={t('save')} /> */}
            </div>

            <aside className='flex flex-row gap-x-7'>
              <Button
                className='bg-base-semantic-success-300 hover:bg-base-semantic-success-400'
                icon={<Check />}
                name='status'
                type='submit'
                label={t('accept')}
                loading={formik.isSubmitting}
                onClick={() =>
                  formik.setFieldValue('status', AppointmentStatus.ACCEPTED)
                }
                disabled={formik.isSubmitting}
              />
              <Button
                className='bg-base-semantic-danger-300 hover:bg-base-semantic-danger-400'
                name='status'
                type='submit'
                icon={<Close />}
                onClick={() =>
                  formik.setFieldValue('status', AppointmentStatus.DENIED)
                }
                label={t('deny')}
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              />
            </aside>
            {/* <Button label={t('save')} disabled /> */}
          </form>
        </Modal>
      </Box>
    </MuiModal>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
}
