import { Body, Title } from '@/components/typography'
import { Box, Modal as MuiModal, Tab, Tabs } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomTabPanel from '@/components/molecules/custom-tab-panel'
import { Profile } from '@/components/profile'
import { Badge } from '@/components/badge'
import { Check, Close, EventOutlined } from '@mui/icons-material'
import Modal from '@/components/molecules/modal'
import Button from '@/components/button'
import Select from '@/components/select'
import Image from '@/components/image'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useClinic } from '@/hooks/use-clinic'
import { AppointmentStatus, type Appointment } from '@/types/clinic'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'

export default function QueuePage() {
  const { t } = useTranslation()

  return (
    <>
      <Title.Large text={t('notifications')} />

      <Card />
    </>
  )
}

// TODO: If the formulary have not been filled, the user is alerted that have to fill out the form to end the appointment.

function Card() {
  const { t } = useTranslation()

  const [value, setValue] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const sections = [<VerifiedAppointments />, <PendingAppointments />]

  return (
    <article className='bg-white shadow-elevation-1'>
      <section>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={t('verified')} />
          <Tab label={t('pending')} />
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

function VerifiedAppointments() {
  const { getVerifiedAppointments } = useClinic()

  const { data: verifiedAppointments } = useQuery({
    queryKey: ['verified-appointments'],
    queryFn: getVerifiedAppointments,
  })

  if (!verifiedAppointments)
    return (
      <>
        <Body.Medium
          className='text-base-neutral-gray-700'
          text='No appointments to show'
        />
      </>
    )

  return (
    <>
      {verifiedAppointments.map((appointment, index) => {
        return <Notification key={index} appointment={appointment} />
      })}
    </>
  )
}

function PendingAppointments() {
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

  return (
    <>
      {pendingAppointments.map((appointment, index) => {
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
      />
    </>
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
  const date = dayjs(datetime).toString()

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

// function AcceptedBadge() {
//   const { t } = useTranslation()

//   return (
//     <Badge
//       className='text-white bg-base-semantic-success-300'
//       label={t('accepted')}
//     />
//   )
// }

// function RejectedBadge() {
//   const { t } = useTranslation()

//   return (
//     <Badge
//       className='text-white bg-base-semantic-danger-300'
//       label={t('rejected')}
//     />
//   )
// }

interface NotificationModalProps {
  appointment: Appointment | undefined
  open: boolean
  handleClose: () => void
}

function NotificationModal(props: NotificationModalProps) {
  const { open, handleClose, appointment } = props
  const { t } = useTranslation()

  const { getMyEmployeesForSelect, respondToAppointment } = useClinic()
  const employees = getMyEmployeesForSelect()

  const { mutateAsync } = useMutation({
    mutationFn: ({
      appointmentStatus,
    }: {
      appointmentStatus: AppointmentStatus
    }) => {
      return respondToAppointment(appointment?.id as string, appointmentStatus)
    },
  })

  const onSubmit = async ({ status }: { status: AppointmentStatus }) => {
    try {
      await mutateAsync({
        appointmentStatus: status,
      })
      handleClose()
    } catch (error) {
      toast.error(t('something-wrong'))
    }
  }

  const formik = useFormik({
    initialValues: {
      status: AppointmentStatus.ACCEPTED,
    },
    onSubmit,
  })

  if (!appointment || !employees) return null

  return (
    <MuiModal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Modal title='Medicina preventiva'>
          <div className='grid mt-5 mb-10 grid--cols-8 gap-y-10'>
            <span className='flex flex-col col-span-3 gap-y-[10px]'>
              <Body.Large text={t('owner')} />

              <div className='flex flex-row items-center gap-x-[10px]'>
                <Image
                  src={appointment.Owner?.image ?? ''}
                  className='rounded-full h-[50px] w-[50px]'
                />
                {/* <Body.Medium text={appointment.Pet.name} /> */}
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
                {/* 
                    {Object.entries(appointment.pet).map(
                      ([key, value]) => {
                        return (
                          <span className='flex flex-col gap-y-[6px]'>
                            <Body.Medium className='text-black' text={t(key)} />
                            <Body.Small
                              className='text-base-neutral-gray-800'
                              text={value as string}
                            />
                          </span>
                        )
                      }
                    )} */}
              </div>
            </span>
            <span className='col-span-3'>
              <Select
                label={t('veterinary')}
                onChange={() => {}}
                // value={undefined}
                options={employees}
                defaultValue={employees[0].value}
              />
            </span>
            <span className='col-span-3'>
              <Body.Large text={t('appointment')} />

              <Body.Medium
                className='text-base-neutral-gray-800'
                text={dayjs(appointment.start_at).format('dddd MMM HH:MM A')}
              />
            </span>

            <span className='col-span-2'>
              <Body.Large text={t('time')} />

              <Body.Medium
                className='text-base-neutral-gray-800'
                text={dayjs(appointment.start_at).format('hh:mm A')}
              />

              {appointment.end_at && (
                <Body.Medium
                  className='text-base-neutral-gray-800'
                  text={dayjs(appointment.end_at).format('hh:mm A')}
                />
              )}
            </span>
            {/* <Button icon={<Check />} label={t('accept')} />
                <Button icon={<Close />} label={t('deny')} />
                <Button label={t('save')} /> */}
          </div>
          <form
            className='flex flex-row justify-between'
            onSubmit={formik.handleSubmit}
          >
            <aside className='flex flex-row gap-x-7'>
              <Button
                className='bg-base-semantic-success-300 hover:bg-base-semantic-success-400'
                icon={<Check />}
                name='status'
                type='submit'
                value={AppointmentStatus.ACCEPTED}
                label={t('accept')}
                loading={formik.isSubmitting}
                disabled={formik.isSubmitting}
              />
              <Button
                className='bg-base-semantic-danger-300 hover:bg-base-semantic-danger-400'
                name='status'
                type='submit'
                icon={<Close />}
                value={AppointmentStatus.DENIED}
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
