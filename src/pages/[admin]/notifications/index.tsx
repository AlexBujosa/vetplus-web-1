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

export default function NotificationsPage() {
  const { t } = useTranslation()

  return (
    <>
      <Title.Large text={t('notifications')} />

      <Card />
    </>
  )
}

// TODO: Change appointment state

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
  return (
    <>
      {notifications.map((notification, index) => {
        return <Notification key={index} {...notification} />
      })}
    </>
  )
}

function PendingAppointments() {
  const [open, setOpen] = useState(false)
  const [selectedNotification, setSelectedNotificaiton] =
    useState<Notification>()

  const handleOpen = (notification: any) => {
    setOpen(true)
    setSelectedNotificaiton(notification)
  }
  const handleClose = () => setOpen(false)
  const { t } = useTranslation()

  return (
    <>
      {notifications.map((notification, index) => {
        return (
          <Notification
            key={index}
            {...notification}
            onClick={() => handleOpen(notification)}
          />
        )
      })}

      {selectedNotification && (
        <MuiModal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Modal title='Medicina preventiva'>
              <div className='grid grid-cols-8 mt-5 mb-10 gap-y-10'>
                <span className='flex flex-col col-span-3 gap-y-[10px]'>
                  <Body.Large text={t('owner')} />

                  <div className='flex flex-row items-center gap-x-[10px]'>
                    <Image className='rounded-full h-[50px] w-[50px]' />
                    <Body.Medium text={selectedNotification.name} />
                  </div>
                </span>

                <span className='flex flex-col col-span-5 gap-y-[10px]'>
                  <Body.Large text={t('pet')} />

                  <div className='flex flex-row gap-x-5'>
                    <Image className='rounded-full h-[50px] w-[50px]' />

                    {Object.entries(selectedNotification.pet).map(
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
                    )}
                  </div>
                </span>

                <span className='col-span-3'>
                  <Body.Large text={t('veterinary')} />

                  <Select
                    onChange={() => {}}
                    value={undefined}
                    options={[
                      { label: 'Juana Palma' },
                      { label: 'Juana Palma' },
                      { label: 'Juana Palma' },
                    ]}
                  />
                </span>

                <span className='col-span-3'>
                  <Body.Large text={t('appointment')} />

                  <Body.Medium
                    className='text-base-neutral-gray-800'
                    text='12 agosto 4:00 PM'
                  />
                </span>

                <span className='col-span-2'>
                  <Body.Large text={t('time')} />

                  <Body.Medium
                    className='text-base-neutral-gray-800'
                    text='12:00 PM'
                  />

                  <Body.Medium
                    className='text-base-neutral-gray-800'
                    text='12:00 PM'
                  />
                </span>
                {/* <Button icon={<Check />} label={t('accept')} />
                <Button icon={<Close />} label={t('deny')} />
                <Button label={t('save')} /> */}
              </div>
              <section className='flex flex-row justify-between'>
                <aside className='flex flex-row gap-x-7'>
                  <Button
                    className='bg-base-semantic-success-300 hover:bg-base-semantic-success-400'
                    icon={<Check />}
                    label={t('accept')}
                  />
                  <Button
                    className='bg-base-semantic-danger-300 hover:bg-base-semantic-danger-400'
                    icon={<Close />}
                    label={t('deny')}
                  />
                </aside>
                <Button label={t('save')} disabled />
              </section>
            </Modal>
          </Box>
        </MuiModal>
      )}
    </>
  )
}

interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  kind: string
  date: string
  createdAt: string
}

function Notification(props: NotificationProps) {
  const { name, kind, date, createdAt, onClick } = props

  return (
    <div
      className='flex flex-row items-center justify-between px-2 py-5 border-b rounded-lg cursor-pointer border-b-base-neutral-gray-500 hover:bg-base-neutral-gray-400'
      onClick={onClick}
    >
      <aside className='flex flex-row items-center gap-x-[30px]'>
        <Profile className='text-black' image={undefined} profile={name} />
        <Badge
          className='bg-base-primary-50 text-base-primary-700'
          label={kind}
        />
        <NotificationDatetime datetime={date} />
      </aside>

      <Body.Medium className='text-base-neutral-gray-700' text={createdAt} />
    </div>
  )
}

function NotificationDatetime(props: { datetime: string }) {
  const { datetime } = props
  const ICON_SIZE = 20

  const iconStyles = { width: ICON_SIZE, height: ICON_SIZE }

  return (
    <span className='flex flex-row gap-x-[10px] items-center'>
      <EventOutlined
        style={iconStyles}
        className='text-base-neutral-gray-700'
      />
      <Body.Medium text={datetime} />
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

const notifications: Notification[] = [
  {
    name: 'Juan Perez',
    kind: 'Medicina preventiva',
    date: '12 ago 3:00 PM',
    createdAt: '7 ago 3:00 PM',
    pet: {
      name: 'Coco',
      breed: 'Alano español',
      age: 3,
      sex: 'Macho',
    },
  },
  {
    name: 'Juan Perez',
    kind: 'Medicina preventiva',
    date: '12 ago 3:00 PM',
    createdAt: '7 ago 3:00 PM',
    pet: {
      name: 'Coco',
      breed: 'Alano español',
      age: 3,
      sex: 'Macho',
    },
  },

  {
    name: 'Juan Perez',
    kind: 'Medicina preventiva',
    date: '12 ago 3:00 PM',
    createdAt: '7 ago 3:00 PM',
    pet: {
      name: 'Coco',
      breed: 'Alano español',
      age: 3,
      sex: 'Macho',
    },
  },
  {
    name: 'Juan Perez',
    kind: 'Medicina preventiva',
    date: '12 ago 3:00 PM',
    createdAt: '7 ago 3:00 PM',
    pet: {
      name: 'Coco',
      breed: 'Alano español',
      age: 3,
      sex: 'Macho',
    },
  },
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
}

type Notification = {
  name: string
  kind: string
  date: string
  createdAt: string
  pet: {
    name: string
    breed: string
    age: number
    sex: string
  }
}
