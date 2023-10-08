import React from 'react'
import { Title } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import Calendar from '@/components/calendar'
import cn from '@/utils/cn'

export default function AppointmentsPage() {
  const { t } = useTranslation()

  return (
    <>
      <Title.Large text={t('appointments')} />

      <main className='grid w-full h-full grid-cols-12'>
        <SideSection />
        <section className='col-span-8 bg-yellow-200'></section>
      </main>
    </>
  )
}

function SideSection() {
  return (
    <aside className='col-span-3'>
      <Calendar />

      <IncomingAppointments />
    </aside>
  )
}

function IncomingAppointments() {
  const appointments = {
    today: [
      {
        label: 'Vacuna',
        hour: '9:00 AM',
      },
      {
        label: 'All-Team Kickoff',
        hour: '12:00 PM',
      },
      {
        label: 'All-Team Kickoff',
        hour: '12:00 PM',
      },
    ],
    tomorrow: [
      {
        label: 'All-Team Kickoff',
        hour: '11:00 AM',
      },
      {
        label: 'All-Team Kickoff',
        hour: '1:00 PM',
      },
    ],
  }

  const colorsArrayRandomIndex = Math.floor(Math.random() * colors.length)
  const randomTextColorClassName = `text-${colors[colorsArrayRandomIndex]}`
  const randomBackgroundColorClassName = `bg-${colors[colorsArrayRandomIndex]}`

  return (
    <section className='flex flex-col gap-y-8'>
      {Object.entries(appointments).map((appointment, index) => {
        return (
          <article key={index} className='flex flex-col gap-y-3'>
            <div className='flex flex-row'>
              <div
                className={cn(
                  'w-[6px] h-[6px]',
                  randomBackgroundColorClassName
                )}
              />

              
            </div>
          </article>
        )
      })}
    </section>
  )
}

const colors = [
  'base-primary-700',
  'base-purple-700',
  'base-pink-700',
  'base-neutral-gray-900',
]
