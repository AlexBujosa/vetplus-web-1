import StarsReview from '@/components/stars-review'
import StatusBadge from '@/components/status-badge'
import { Body, Title } from '@/components/typography'
import { useClinic } from '@/hooks/use-clinic'
import { useParams } from 'react-router-dom'

export default function EmployeesDetailPage() {
  const params = useParams()
  const { email } = params
  const { findEmployeeByEmail } = useClinic()
  const selectedEmployee = findEmployeeByEmail(email!)

  if (!selectedEmployee) return null

  const { telephoneNumber, address, specialty, score, status } =
    selectedEmployee

  console.log(selectedEmployee)

  const data: Record<string, JSX.Element> = {
    'Correo electrónico': <Typography text={email} />,
    Teléfono: <Typography text={telephoneNumber} />,
    Dirección: <Typography text={address} />,
    Especialidad: <Typography text={specialty} />,
    Calificación: <StarsReview review={score} />,
    Estado: <StatusBadge status={status} />,
  }

  return (
    <main className='flex flex-col gap-y-[60px]'>
      <section>{email}</section>
      <section className='shadow-elevation-1'>
        <div className='px-[30px] py-[15px] border border-b-base-neutral-gray-500'>
          <Title.Medium className='font-semibold' text='Descripción general' />
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
    </main>
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
