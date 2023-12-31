import { Body, Label, Title } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/cn'
import Button from '@/components/button'
import useCalendar from '@/hooks/use-calendar'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import dayjs, { type Dayjs } from 'dayjs'
import { getWeekdayInLocale } from '@/utils'
import { useAtomValue } from 'jotai'
import { currentMonthAtom, monthAtom } from '@/hooks/use-calendar/monthAtom'

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

  const { handlePrevMonth, handleNextMonth } = useCalendar()

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
                {day.format('dd').charAt(0)}
              </span>
            ))}
            {currentMonth.map((row) => (
              <>
                {row.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      null
                    }}
                    className='w-full py-1 rounded-full hover:bg-base-neutral-gray-500'
                  >
                    <span className='text-sm'>{day.format('D')}</span>
                  </button>
                ))}
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

      <Label.ExtraLarge className='select-none' text={getDateString()} />
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
        <div className='h-[60px]' />
        {intervals.map((interval, index) => {
          return (
            <span key={index} className='flex items-start justify-end h-[60px]'>
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
                const now = dayjs()
                const actualHour = now.hour()
                const intervalHour = dayjs(interval, 'h A').hour()

                const isBetweenInterval = actualHour === intervalHour

                return (
                  <div className='h-[60px] border border-base-neutral-gray-600'>
                    {isBetweenInterval && (
                      <TimeBadge time={now} procedure='Vacuna' />
                    )}
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
  const timeString = time.format('h:mm A')

  return (
    <span className='flex h-full border-l rounded-l-md'>
      <div
        className={cn(
          'w-1 h-full mr-[6px] rounded-l-lg',
          'bg-base-primary-700'
        )}
      />

      <span className='flex flex-col'>
        <Label.Small className='font-medium' text={timeString} />
        <Body.Small className='font-normal' text={procedure} />
      </span>
    </span>
  )
}
