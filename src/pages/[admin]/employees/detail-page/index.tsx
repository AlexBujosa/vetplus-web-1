import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import Button from '@/components/button'
import { useState } from 'react'
import cn from '@/utils/cn'
import { useClinic } from '@/hooks/use-clinic'
import { Clinic } from '@/types/clinic'
import toast from 'react-hot-toast'

export default function EmployeesDetailPage() {
  const params = useParams()
  const { email: employeeEmail } = params
  const { getMyEmployees } = useClinic()

  const { data: clinicEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: getMyEmployees,
  })

  if (!clinicEmployees) return null

  // @ts-ignore
  const clinicEmployee = clinicEmployees.find(
    ({ Employee }: { Employee: any }) => {
      return Employee.email === employeeEmail
    }
  )

  if (!clinicEmployee) return null

  return (
    <main className='flex flex-col gap-y-[40px]'>
      <EmployeeHeader employee={clinicEmployee} />
      <GeneralDescription
        employee={clinicEmployee.Employee}
        status={clinicEmployee.status}
      />
    </main>
  )
}

function EmployeeHeader({ employee }: { employee: any }) {
  const [employeeStatus, setEmployeeStatus] = useState<boolean>(employee.status)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  // @ts-ignore
  const { names, surnames, image } = employee.Employee

  const fullName = surnames ? `${names} ${surnames}` : names

  const { changeEmployeeStatus } = useClinic()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: changeEmployeeStatus,
  })

  const clinic: Clinic | undefined = queryClient.getQueryData(['clinic'])

  const handleStatusChange = () => {
    if (!clinic) return

    toast.promise(
      mutateAsync({
        id_clinic: clinic.id,
        id_employee: employee.id_employee,
        new_status: !employeeStatus,
      }),
      {
        success: t('updated-fields'),
        loading: t('loading'),
        error: t('something-wrong'),
      }
    )

    setEmployeeStatus((prevStatus) => !prevStatus)

    // queryClient.setQueryData(['employees'], (oldData: any) => {
    //   // @ts-ignore
    //   const newData = oldData.map((item) =>
    //     // @ts-ignore
    //     item.id_employee === employee.id_employee
    //       ? { ...item, status: !employeeStatus }
    //       : item
    //   )
    //   console.log({ newData: newData[0].status })
    //   return newData
    // })

    queryClient.invalidateQueries()
  }

  return (
    <section className='flex flex-row items-center justify-between'>
      <div className='flex flex-col gap-y-7'>
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
      </div>

      <Button
        loading={isPending}
        disabled={isPending}
        className={cn(
          employeeStatus
            ? 'bg-base-semantic-danger-600 hover:bg-base-semantic-danger-500'
            : 'bg-base-primary-600 hover:bg-base-primary-500'
        )}
        label={employeeStatus ? t('disable') : t('enable')}
        onClick={handleStatusChange}
      />
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
    <div className='grid col-span-2 bg-white rounded-lg shadow-elevation-1'>
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
