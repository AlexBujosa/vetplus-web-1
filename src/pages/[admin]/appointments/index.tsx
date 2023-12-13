import { type PropsWithChildren } from 'react'
import { Body, Label, Title } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/cn'
import Button from '@/components/button'
import useCalendar from '@/hooks/use-calendar'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import dayjs, { type Dayjs } from 'dayjs'
import { getWeekdayInLocale } from '@/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  currentMonthAtom,
  monthAtom,
  weekAtom,
} from '@/hooks/use-calendar/monthAtom'
import { useQuery } from '@tanstack/react-query'
import { useClinic } from '@/hooks/use-clinic'
import { useNavigate } from 'react-router-dom'
import { appointmentsAtom } from '@/hooks/use-clinic/appointmentsAtom'

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
  const currentMonthIdx = useAtomValue(monthAtom)
  const currentMonth = useAtomValue(currentMonthAtom)

  const { handlePrevMonth, handleNextMonth, handleDateClick } = useCalendar()

  const { getVerifiedAppointments } = useClinic()

  const { data: allAppointments } = useQuery({
    queryKey: ['verified-appointments'],
    queryFn: getVerifiedAppointments,
  })

  return (
    <aside className='col-span-2 border-r-2 border-r-base-neutral-gray-600'>
      <div className='w-full h-full'>
        <div className='mt-9'>
          <header className='flex flex-row items-center justify-between'>
            <p className='font-bold text-gray-500'>
              {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
                'MMMM YYYY'
              )}
            </p>

            <aside className='flex flex-row items-center'>
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
            </aside>
          </header>
          <div className='grid grid-cols-7 grid-rows-6'>
            {currentMonth[0].map((day, i) => (
              <span
                key={i}
                className='py-1 text-sm text-center select-none text-base-primary-600'
              >
                {dayjs(day).format('dd').charAt(0)}
              </span>
            ))}
            {currentMonth.map((row) => (
              <>
                {row.map((day, idx) => {
                  // Check if the current date in the loop is today
                  const isToday = dayjs(day).isSame(dayjs(), 'day')

                  // Check if there is an appointment for the current date
                  const hasAppointment = allAppointments
                    ? allAppointments.some(({ start_at }) =>
                        dayjs(start_at).isSame(dayjs(day), 'day')
                      )
                    : false

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(day)}
                      className={`w-full rounded-full hover:bg-base-neutral-gray-500 ${
                        isToday && 'bg-blue-500 hover:bg-blue-600 text-white'
                      } ${
                        hasAppointment &&
                        'bg-red-500 text-white hover:bg-red-400'
                      }`}
                    >
                      <span className='text-sm'>{dayjs(day).format('D')}</span>
                    </button>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      <IncomingAppointments />
    </aside>
  )
}

function IncomingAppointments() {
  // const { getAppointments } = useClinic()

  // const { data } = useQuery({
  //   queryKey: ['appointments'],
  //   queryFn: getAppointments,
  // })

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
      {Object.entries(appointments).map((_appointment, index) => {
        return (
          <article key={index} className='flex flex-col gap-y-3'>
            <div className='flex flex-row'>
              <div className={cn('w-[6px] h-[6px]')} />
            </div>
          </article>
        )
      })}
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

  const { handleReset, handleNextWeek, handlePrevWeek, getDateString } =
    useCalendar()

  const { getVerifiedAppointments } = useClinic()

  const { data: allAppointments } = useQuery({
    queryKey: ['verified-appointments'],
    queryFn: getVerifiedAppointments,
  })

  const appointmentsCount = allAppointments?.length ?? 0

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
        onClick={handlePrevWeek}
        icon={<ChevronLeft />}
      />

      <Button
        className='text-base-primary-500'
        intent='tertiary'
        onClick={handleNextWeek}
        icon={<ChevronRight />}
      />

      <Label.ExtraLarge className='select-none' text={getDateString()} />

      <Label.ExtraLarge
        className='ml-auto font-bold text-base-primary-600'
        text={`${appointmentsCount} ${t('appointments')}`}
      />
    </header>
  )
}

function CalendarWeek() {
  const { getVerifiedAppointments, getVeterinaryAppointments } = useClinic()

  const { data: allAppointments } = useQuery({
    queryKey: ['verified-appointments'],
    queryFn: getVerifiedAppointments,
  })

  const week = useAtomValue(weekAtom)
  const startOfWeek = dayjs(getMonday(week))
  const arr = getWeekDays(startOfWeek)
  const intervals = generateTimeIntervals()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAppointments = useSetAtom(appointmentsAtom)

  return (
    <div className='grid flex-1 grid-cols-7'>
      <aside className='flex flex-col'>
        <div className='h-[60px]' />
        {intervals.map(({ time }, index) => {
          return (
            <span key={index} className='flex items-start justify-end h-[60px]'>
              <Body.Small
                className='mx-3 text-base-neutral-gray-800'
                text={time}
              />
            </span>
          )
        })}
      </aside>

      {arr.map((day, index) => {
        {
          const workingDay = arr[index]

          const dayAppointments = allAppointments?.filter(({ start_at }) => {
            return dayjs(workingDay).isSame(start_at, 'day')
          })

          const weekday = getWeekdayInLocale(day)
          const dayNumber = day.get('D').toString()

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

              {intervals.map(({ time }: { time: string }) => {
                const intervalHour = dayjs(time, 'h A').hour()

                const appointmentsInInterval = dayAppointments?.filter(
                  (date) => {
                    const startingHour = dayjs(date.start_at).hour() + 4

                    return (
                      startingHour >= intervalHour &&
                      startingHour + 1 <= intervalHour + 1
                    )
                  }
                )

                const appointmentsCount = appointmentsInInterval?.length ?? 0

                if (appointmentsCount === 0)
                  return (
                    <div className='h-[60px] border border-base-neutral-gray-600' />
                  )

                return (
                  <div
                    className='cursor-pointer h-[60px] border border-base-neutral-gray-600'
                    onClick={() => {
                      setAppointments(appointmentsInInterval)
                      navigate('/appointment-detail')
                    }}
                  >
                    <TimeBadge className='bg-base-primary-50'>
                      <Label.Medium
                        className='text-base-primary-700'
                        text={time}
                      />

                      <Body.Small
                        className='text-base-primary-700'
                        text={
                          !appointmentsInInterval
                            ? `${appointmentsCount} ${t('appointments')}`
                            : appointmentsInInterval[0].services.join()
                        }
                      />
                    </TimeBadge>
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

function getMonday(date: Dayjs) {
  const d = dayjs(date)
  const diffToMonday = d.day() - 1
  // Subtract the difference to get the Monday date
  const mondayDate = d.subtract(diffToMonday, 'day')

  return mondayDate
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

function generateTimeIntervals(
  startHour: number = 7,
  endHour: number = 23
): { time: string }[] {
  const intervals = []
  const startTime = dayjs().set('hour', startHour).startOf('hour')
  const endTime = dayjs().set('hour', endHour).startOf('hour')

  let currentHour = startTime
  while (!currentHour.isAfter(endTime)) {
    intervals.push({ time: currentHour.format('h A') })
    currentHour = currentHour.add(1, 'hour')
  }

  return intervals
}

interface TimeBadgeProps extends PropsWithChildren {
  className: string
}

function TimeBadge(props: TimeBadgeProps) {
  const { children, className } = props

  return (
    <span className='flex h-full border-l rounded-l-md'>
      <div className={cn('w-1 h-full rounded-l-lg', 'bg-base-primary-700')} />

      <span className={cn('flex flex-col w-full pl-[6px]', className)}>
        {children}
      </span>
    </span>
  )
}
