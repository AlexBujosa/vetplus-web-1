import Button from '@/components/button'
import { routes } from '@/config/routes'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import { appointmentsAtom } from '@/hooks/use-clinic/appointmentsAtom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import dayjs from 'dayjs'
import Image from '@/components/image'
import { ReceiptLong } from '@mui/icons-material'
import Select from '@/components/select'
import { useQuery } from '@tanstack/react-query'
import { useClinic } from '@/hooks/use-clinic'
import { Role } from '@/types/role'

const headers = ['pet', 'veterinary', 'services', 'appointment', 'attend']

export default function AppointmentDetail() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <Button onClick={() => navigate(routes.admin.pages.appointments.href)}>
        {t('go-back')}
      </Button>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <Header />

          <Body />
        </Table>
      </TableContainer>
    </>
  )
}

function Header() {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => {
          return <TableCell key={header}>{t(header)}</TableCell>
        })}
      </TableRow>
    </TableHead>
  )
}

function Body() {
  const appointments = useAtomValue(appointmentsAtom)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { getMyEmployees } = useClinic()

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: getMyEmployees,
  })

  if (!appointments || !employees) return null

  const employeesList = employees.filter((employee) => {
    return employee.role === Role.VETERINARIAN
  })

  // TODO: As an admin, I could switch the veterinary related to that appointment

  return (
    <TableBody>
      {appointments.map(({ id, Pet, start_at, Veterinarian, services }) => {
        const options = employeesList.map(({ id, fullName }) => {
          return { value: id, label: fullName }
        })

        return (
          <TableRow
            key={id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell align='right'>
              <div className='flex flex-row items-center gap-x-3'>
                <Image className='w-10 h-10 rounded-full' src={Pet.image} />
                {Pet.name}
              </div>
            </TableCell>

            <TableCell component='th' scope='row'>
              <Select
                label={t('veterinary')}
                options={options}
                defaultValue={Veterinarian.id}
              />
            </TableCell>

            <TableCell component='th' scope='row'>
              <ul>
                {services.map((service) => {
                  return <li key={service}>{service}</li>
                })}
              </ul>
            </TableCell>

            <TableCell component='th' scope='row'>
              {dayjs(start_at).add(4, 'hour').format('hh:mm A')}
            </TableCell>

            <TableCell component='th' scope='row'>
              <Button onClick={() => navigate(id)}>
                <ReceiptLong />
              </Button>
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

/*
TODO: Create form
1. Diagnosticos
2. Tratamientos y procesos administrados
3. Medicamentos recetados
4. Resultados de pruebas medicas texto
5. Peso
6. Vacunas
6.1 Recurrencia

*/
