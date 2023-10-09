import React from 'react'
import { Body, Label, Title } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/cn'
import Button from '@/components/button'
import useCalendar from '@/hooks/use-calendar'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import dayjs, { type Dayjs } from 'dayjs'
import { getWeekdayInLocale } from '@/utils'

export default function AppointmentsPage() {
  const { t } = useTranslation()

  return (
    <>
      <Title.Large text={t('appointments')} />

      <main className='grid w-full h-full grid-cols-12'>
        <SideSection />
        <CalendarSection />
      </main>
    </>
  )
}

function SideSection() {
  return (
    <aside className='col-span-2 border-r-2 border-r-base-neutral-gray-600'>
      <div className='w-full h-full' />

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

  return (
    <section className='flex flex-col gap-y-8'>
      <AppointmentsList appointments={appointments} />
    </section>
  )
}

function AppointmentsList(props: { appointments: any }) {
  const { appointments } = props

  return (
    <>
      {/* {Object.entries(appointments).map((appointment, index) => {
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
      })} */}
    </>
  )
}

function CalendarSection() {
  return (
    <main className='w-full col-span-10'>
      <CalendarHeader />
      <CalendarWeek />
    </main>
  )
}

function CalendarHeader() {
  const { t } = useTranslation()

  const { handleReset, handleNextMonth, handlePrevMonth, getDateString } =
    useCalendar()

  return (
    <header className='flex flex-row items-center w-full px-4 py-2 mb-6 gap-x-2'>
      <Button
        className='px-6 font-medium text-black border border-base-neutral-gray-600'
        intent='outline'
        onClick={handleReset}
        label={t('today')}
      />

      <Button
        className='text-base-primary-500'
        intent='tertiary'
        onClick={handlePrevMonth}
        icon={<ChevronLeft />}
      />

      <Button
        className='text-base-primary-500'
        intent='tertiary'
        onClick={handleNextMonth}
        icon={<ChevronRight />}
      />

      <Label.ExtraLarge text={getDateString()} />
    </header>
  )
}

function CalendarWeek() {
  const startOfWeek = dayjs(getMonday())
  const arr = getWeekDays(startOfWeek)
  const intervals = generateTimeIntervals()

  return (
    <div className='grid flex-1 grid-cols-7'>
      <aside className='flex flex-col'>
        <div className='h-[66px]' />
        {intervals.map((interval) => {
          return (
            <span className='flex items-start justify-end h-[66px]'>
              <Body.Small
                className='mx-3 text-base-neutral-gray-800'
                key={interval}
                text={interval}
              />
            </span>
          )
        })}
      </aside>

      {arr.map((day, index) => {
        {
          const weekday = getWeekdayInLocale(day)
          const dayNumber = (day.day() + 1).toString()

          return (
            <article key={index} className='flex flex-col'>
              <header
                key={index}
                className='flex flex-col gap-y-1 border border-base-neutral-gray-600 border-t-0 py-[10px] px-[15px]'
              >
                <Label.Medium
                  className='text-base-neutral-gray-900'
                  text={weekday}
                />

                <Label.ExtraLarge text={dayNumber} />
              </header>

              {intervals.map((interval) => {
                return (
                  <div className='h-[60px] border border-base-neutral-gray-600'>
                    <TimeBadge time={dayjs()} procedure='Vacuna' />
                  </div>
                )
              })}
            </article>
          )
        }
      })}
    </div>
  )
}

function getMonday() {
  const d = new Date()
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

function getWeekDays(start: Dayjs) {
  const end = start.add(5, 'day')
  const range = []
  let current = start
  while (!current.isAfter(end)) {
    range.push(current)
    current = current.add(1, 'days')
  }
  return range
}

function generateTimeIntervals(startHour: number = 7, endHour: number = 18) {
  const intervals = []
  const startTime = dayjs().set('hour', startHour).startOf('hour')
  const endTime = dayjs().set('hour', endHour).startOf('hour')

  let currentHour = startTime
  while (!currentHour.isAfter(endTime)) {
    intervals.push(currentHour.format('h A'))
    currentHour = currentHour.add(1, 'hour')
  }

  return intervals
}

function TimeBadge(props: { time: Dayjs; procedure: string }) {
  const { time, procedure } = props
  const timeString = time.format('h:HH A')

  const colors = ['base-primary', 'slate', 'pink']

  const colorsArrayRandomIndex = Math.floor(Math.random() * colors.length)
  const randomColor = colors[colorsArrayRandomIndex]
  const randomTextColorClassName = `text-${randomColor}-700`
  const randomBackgroundColorClassName = `bg-${randomColor}-50`
  const randomLeftBorderClassName = `bg-${randomColor}-500`

  return (
    <span
      className={cn(
        'h-full flex rounded-l-md border-l',
        randomTextColorClassName,
        randomBackgroundColorClassName
      )}
    >
      <div
        className={cn(
          'w-1 h-full mr-[6px] rounded-l-lg',
          randomLeftBorderClassName
        )}
      />

      <span className='flex flex-col'>
        <Label.Small className='font-medium' text={timeString} />
        <Body.Small className='font-normal' text={procedure} />
      </span>
    </span>
  )
}
