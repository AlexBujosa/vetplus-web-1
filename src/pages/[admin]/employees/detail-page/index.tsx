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
import calculateStars from '@/utils/calcScore'

export default function EmployeesDetailPage() {
  const params = useParams()
  const { email: employeeEmail } = params
  const client = useQueryClient()

  // @ts-ignore
  const clinicEmployees:
    | { id_employee: string; Employee: Employee; status: boolean }[]
    | undefined = client.getQueryData(['employees'])

  if (!clinicEmployees) return null

  const clinicEmployee = clinicEmployees.find(({ Employee }) => {
    return Employee.email === employeeEmail
  })

  if (!clinicEmployee) return null

  return (
    <main className='flex flex-col gap-y-[40px]'>
      <EmployeeHeader employee={clinicEmployee.Employee} />
      <GeneralDescription
        employee={clinicEmployee.Employee}
        status={clinicEmployee.status}
      />
    </main>
  )
}

function EmployeeHeader({ employee }: { employee: Employee }) {
  const navigate = useNavigate()

  // @ts-ignore
  const { names, surnames, image } = employee

  const fullName = `${names} ${surnames}`

  return (
    <section className='flex flex-col gap-y-7'>
      <div className='flex flex-row gap-x-[20px]'>
        <IconButton
          onClick={() => navigate(routes.admin.pages.employees.href)}
          children={<KeyboardBackspace className='text-black' />}
        />
        <Headline.Medium text={fullName} />
      </div>

      <div className='flex flex-row items-center justify-between gap-x-5'>
        <ProfileWithRole image={image} />
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

      <span className='flex flex-row gap-x-[6px] p-[10px] border rounded-lg border-base-neutral-gray-500 bg-base-neutral-white text-base-neutral-gray-800 items-center'>
        <PersonOutlined />
        <Body.Large text={t('employee')} />
      </span>
    </div>
  )
}

function GeneralDescription({
  employee,
  status,
}: {
  employee: Employee
  status: boolean
}) {
  const {
    email,
    telephone_number,
    address,
    VeterinarianSummaryScore,
    VeterinariaSpecialties,
  } = employee
  const { t } = useTranslation()

  const data: Record<string, JSX.Element> = {
    [t('email')]: <Typography text={email ?? 'N/A'} />,
    [t('telephone-number')]: <Typography text={telephone_number ?? 'N/A'} />,
    [t('address')]: <Typography text={address ?? 'N/A'} />,
    [t('specialty')]: (
      <Typography text={VeterinariaSpecialties?.specialties ?? 'N/A'} />
    ),
    [t('review')]: (
      <StarsReview review={calculateStars(VeterinarianSummaryScore) ?? 'N/A'} />
    ),
    [t('status')]: <StatusBadge status={status} />,
  }

  return (
      <div className='col-span-2 grid bg-white rounded-lg shadow-elevation-1'>
        <div className='px-[30px] py-[15px] border-b border-b-neutral-gray-500 h-fit'>
          <Title.Medium
          className='font-semibold'
          text={t('general-description')}
        />
        </div>
        <div className='grid grid-cols-2 grid-rows-auto gap-y-10 gap-x-32 px-[30px] py-[38px]'>
           {Object.keys(data).map((key) => (
          <div className='flex flex-row items-center gap-x-[30px]' key={key}>
            <Body.Large className='text-black' text={key} />

            {data[key]}
          </div>
        ))}
        </div>
      </div>
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
