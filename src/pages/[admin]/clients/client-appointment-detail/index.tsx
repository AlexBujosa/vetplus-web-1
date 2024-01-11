import React, { HTMLProps, PropsWithChildren } from 'react'
import { Appointment } from '@/types/clinic'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { KeyboardBackspace } from '@mui/icons-material'
import { Headline, Label, Title, Body } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/cn'
import { Profile } from '@/components/profile'
import dayjs from 'dayjs'

export default function ClientAppointmentPage() {
  const params = useParams()
  const { t } = useTranslation()
  const client = useQueryClient()
  const navigate = useNavigate()
  const { appointmentId } = params

  const appointments: Appointment[] | undefined = client.getQueryData([
    'verified-appointments',
  ])

  if (!appointments) return navigate(-1)

  const appointment = appointments.find(({ id }) => {
    return id === appointmentId
  })

  if (!appointment) return navigate(-1)

  return (
    <section className='flex flex-col mb-10 gap-y-7'>
      <div className='flex flex-row gap-x-[20px]'>
        <IconButton
          onClick={() => navigate(-1)}
          children={<KeyboardBackspace className='text-black' />}
        />
        <Headline.Medium text={t('go-back')} />
      </div>

      <div className='space-y-4'>
        <div className='flex flex-col gap-y-3'>
          <Title.Large text={t('appointment-details')} />
          <span className='grid items-center grid-cols-2 grid-rows-1 w-fit gap-x-3'>
            <Label.Large text={t('pet')} />
            <Profile
              image={appointment.Pet.image}
              profile={appointment.Pet.name}
            />

            <Label.Large text={t('owner')} />
            <Profile
              image={appointment.Owner.image}
              profile={
                appointment.Owner.surnames
                  ? `${appointment.Owner.names} ${appointment.Owner.surnames}`
                  : appointment.Owner.names
              }
            />
          </span>

          <Label.Large text={t('start-at')} />
          <Label.Medium text={dayjs(appointment.start_at).format('LLLL')} />

          <Label.Large text={t('end-at')} />
          <Label.Medium
            text={
              appointment.end_at
                ? dayjs(appointment.end_at).format('LLLL')
                : 'N/A'
            }
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Card className='col-span-2'>
            <Title.Large text={t('deworming')} />

            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label.Large text={t('date')} />
                  <Body.Medium text='December 6, 2023' />
                </div>
                <div>
                  <Label.Large text={t('product')} />
                  <Body.Medium text='ProductoXXX' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <Title.Large text={t('vaccines')} />

            <CardContent>
              <div className='space-y-2'>
                <div>
                  <Label.Large text={t('brand')} />
                  <Body.Medium text='' />
                </div>
                <div>
                  <Label.Large text={t('batch')} />
                  <Body.Medium text='' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <Title.Large text={t('reproductive-timeline')} />
            <CardContent>
              <div className='space-y-2'>
                <div>
                  <Label.Large text={t('reproductive-history')} />

                  <Body.Medium text='' />
                </div>
                <div>
                  <Label.Large text={t('last-heat')} />
                  <Body.Medium text='' />
                </div>
                <div>
                  <Label.Large text={t('last-birth')} />
                  <Body.Medium text='' />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='col-span-2'>
            <Title.Large text={t('observations')} />
            <CardContent>
              <ul className='pl-5 list-disc'>
                <li>No current suffering reported</li>
                <li>No special treatment required</li>
                <li>Regular feed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

interface CardProps extends PropsWithChildren, HTMLProps<HTMLDivElement> {}

function Card(props: CardProps) {
  return (
    <article
      className={cn(props.className, 'border border-base-neutral-gray-800 p-4')}
    >
      {props.children}
    </article>
  )
}

function CardContent(props: CardProps) {
  return <section className={cn(props.className)}>{props.children}</section>
}
