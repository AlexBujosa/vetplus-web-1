import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Employee } from '@/hooks/use-clinic/employeesAtom'
import StarsReview from '@/components/stars-review'
import StatusBadge from '@/components/status-badge'
import { Title, Headline, Body } from '@/components/typography'
import { routes } from '@/config/routes'
import { IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { KeyboardBackspace, PersonOutlined } from '@mui/icons-material'
import ProfileImage from '@/components/profile-image'

export default function EmployeesDetailPage() {
  const params = useParams()
  const { email: employeeEmail } = params
  const client = useQueryClient()

  const clinicEmployees: any[] | undefined = client.getQueryData(['employees'])

  if (!clinicEmployees) return null

  const clinicEmployee: Employee = clinicEmployees.find(({ email }) => {
    return email === employeeEmail
  })

  return (
    <main className='flex flex-col gap-y-[60px]'>
      <EmployeeHeader employee={clinicEmployee} />
      <GeneralDescription employee={clinicEmployee} />
    </main>
  )
}

function EmployeeHeader({ employee }: { employee: Employee }) {
  const navigate = useNavigate()

  return (
    <section className='flex flex-col gap-y-7'>
      <div className='flex flex-row gap-x-[20px]'>
        <IconButton
          onClick={() => navigate(routes.admin.pages.employees.href)}
          children={<KeyboardBackspace className='text-black' />}
        />
        <Headline.Medium text={employee.fullName} />
      </div>

      <div className='flex flex-row items-center justify-between gap-x-5'>
        <ProfileWithRole image={employee.image} />
      </div>
    </section>
  )
}

function ProfileWithRole({ image }: { image: string }) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-row gap-x-[10px] items-center'>
      <ProfileImage
        className='w-[100px] h-[100px]'
        src={image}
        loading={!image}
      />

      <span className='flex flex-row gap-x-[6px] p-[10px] border border-base-neutral-gray-500 text-base-neutral-gray-800'>
        <PersonOutlined />
        <Body.Large text={t('employee')} />
      </span>
    </div>
  )
}

function GeneralDescription({ employee }: { employee: Employee }) {
  const { email, telephoneNumber, address, specialty, score, status } = employee
  const { t } = useTranslation()

  const data: Record<string, JSX.Element> = {
    [t('email')]: <Typography text={email} />,
    [t('telephone-number')]: <Typography text={telephoneNumber} />,
    [t('address')]: <Typography text={address} />,
    [t('speciality')]: <Typography text={specialty} />,
    [t('review')]: <StarsReview review={score} />,
    [t('status')]: <StatusBadge status={status} />,
  }

  return (
    <section className='shadow-elevation-1'>
      <div className='px-[30px] py-[15px] border border-b-base-neutral-gray-500'>
        <Title.Medium
          className='font-semibold'
          text={t('general-description')}
        />
      </div>

      <div className='grid grid-cols-2 grid-rows-3 p-[30px]'>
        {Object.keys(data).map((key) => (
          <div className='flex flex-row items-center gap-x-[30px]' key={key}>
            <Body.Large className='text-black' text={key} />

            {data[key]}
          </div>
        ))}
      </div>
    </section>
  )
}

function Typography(props: { text?: string }) {
  const { text } = props

  return (
    <Body.Medium
      className='font-normal text-base-neutral-gray-800'
      text={text || 'N/A'}
    />
  )
}
