import Button from '@/components/button'
import { routes } from '@/config/routes'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import { appointmentsAtom } from '@/hooks/use-clinic/appointmentsAtom'
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import dayjs from 'dayjs'
import Image from '@/components/image'
import {
  FileOpenOutlined,
  KeyboardBackspace,
  ReceiptLong,
} from '@mui/icons-material'
import Select from '@/components/select'
import { useClinic } from '@/hooks/use-clinic'
import { Headline } from '@/components/typography'
import { userAtom } from '@/hooks/use-user/userAtom'
import { Profile } from '@/components/profile'

const headers = ['pet', 'veterinary', 'services', 'appointment', 'attend']

export default function AppointmentDetail() {
  const appointments = useAtomValue(appointmentsAtom)
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <div className='flex flex-row items-center gap-x-8'>
        <IconButton
          className='w-fit'
          onClick={() => navigate(routes.admin.pages.appointments.href)}
        >
          <KeyboardBackspace />
        </IconButton>

        <Headline.Medium text={t('appointments')} />

        {appointments && (
          <article className='px-5 py-2 border rounded-md border-base-neutral-gray-600'>
            {dayjs(appointments[0].start_at).add(4, 'hour').format('LLLL')}
          </article>
        )}
      </div>

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
  const user = useAtomValue(userAtom)

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { getMyEmployeesForSelect } = useClinic()

  const employees = getMyEmployeesForSelect()

  if (!appointments || !employees) return null

  // TODO: As an admin, I could switch the veterinary related to that appointment

  return (
    <TableBody>
      {appointments.map(({ id, Pet, start_at, Veterinarian, services }) => {
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
              {user?.role === 'CLINIC_OWNER' ? (
                <Select
                  label={t('veterinary')}
                  options={employees}
                  defaultValue={Veterinarian.id}
                />
              ) : (
                <Profile
                  profile={`${Veterinarian?.names} ${Veterinarian?.surnames}`}
                  image={Veterinarian.image}
                />
              )}
            </TableCell>

            <TableCell component='th' scope='row'>
              {dayjs(start_at).add(4, 'hour').format('h:mm A')}
            </TableCell>

            <TableCell component='th' scope='row'>
              <ul>
                {services.map((service) => {
                  return <li key={service}>{service}</li>
                })}
              </ul>
            </TableCell>

            <TableCell component='th' scope='row'>
              <IconButton onClick={() => navigate(id)}>
                <FileOpenOutlined />
              </IconButton>
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
