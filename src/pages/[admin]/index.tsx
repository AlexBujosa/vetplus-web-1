import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { Label, Title } from '@/components/typography'
import {
  AssignmentIndOutlined,
  EventOutlined,
  PetsOutlined,
} from '@mui/icons-material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import cn from '@/utils/cn'
import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
  return (
    <>
      <DashboardCards />

      <ChartsSection />
    </>
  )
}

function DashboardCards() {
  const { t } = useTranslation()

  return (
    <div className='grid grid-cols-4 gap-[30px]'>
      <DashboardCard
        icon={<EventOutlined />}
        label={t('registered-pets')}
        amount={123}
      />

      <DashboardCard
        icon={<PetsOutlined />}
        label={t('clients')}
        amount={123}
      />

      <DashboardCard
        icon={<AssignmentIndOutlined />}
        label={t('active-employees')}
        amount={123}
      />

      <DashboardCard
        icon={<AssignmentIndOutlined />}
        label={t('pending-appointments')}
        amount={123}
      />
    </div>
  )
}

function DashboardCard({
  icon,
  label,
  amount,
}: {
  icon: JSX.Element
  label: string
  amount: number
}) {
  return (
    <Card className='rounded-[10px] flex flex-row gap-x-4'>
      <div className='flex items-center justify-center rounded-full h-14 w-14 text-base-primary-500 bg-base-neutral-gray-300'>
        {React.cloneElement(icon, { width: 30, height: 30 })}
      </div>
      <div className='flex flex-col items-center gap-y-2'>
        <Label.Large className='text-base-neutral-gray-700' text={label} />
        <Title.Large className='self-start' text={amount.toString()} />
      </div>
    </Card>
  )
}

const data = [
  {
    name: 'Ene',
    clients: 650,
  },
  {
    name: 'Feb',
    clients: 3000,
  },
  {
    name: 'Mar',
    clients: 700,
  },
  {
    name: 'Abr',
    clients: 2780,
  },
  {
    name: 'May',
    clients: 1890,
  },
  {
    name: 'Jun',
    clients: 2390,
  },
  {
    name: 'Jul',
    clients: 3490,
  },
  {
    name: 'Ago',
    clients: 1490,
  },
  {
    name: 'Sep',
    clients: 232,
  },
  {
    name: 'Oct',
    clients: 1145,
  },
  {
    name: 'Nov',
    clients: 654,
  },
  {
    name: 'Dec',
    clients: 112,
  },
]

function ChartsSection() {
  const { t } = useTranslation()

  return (
    <>
      <Title.Medium text={t('clients-traffic')} />
      <Card className='w-fit'>
        <BarChart
          width={600}
          height={270}
          data={data}
          margin={{
            top: 5,
            left: 30,
            right: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='clients' className='fill-base-primary-500' />
        </BarChart>
      </Card>
    </>
  )
}

interface CardProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {}

function Card(props: CardProps) {
  const { className, children } = props

  return (
    <article
      className={cn(
        'bg-base-neutral-white shadow-elevation-1 p-[25px]',
        className
      )}
    >
      {children}
    </article>
  )
}
