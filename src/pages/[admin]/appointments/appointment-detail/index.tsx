import { routes } from '@/config/routes'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAtom, useAtomValue } from 'jotai'
import { appointmentsAtom } from '@/hooks/use-clinic/appointmentsAtom'
import {
  CircularProgress,
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
  SyncAltOutlined,
} from '@mui/icons-material'
import Select from '@/components/select'
import { useClinic } from '@/hooks/use-clinic'
import { Headline } from '@/components/typography'
import { userAtom } from '@/hooks/use-user/userAtom'
import { Profile } from '@/components/profile'
import { Role } from '@/types/role'
import { Appointment, Veterinarian } from '@/types/clinic'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { roleAtom } from '@/hooks/use-auth/roleAtom'
import { every, isNull } from 'lodash'

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
  const role = useAtomValue(roleAtom)

  const headers =
    role !== Role.VETERINARIAN
      ? ['pet', 'veterinary', 'services', 'appointment', 'attend']
      : ['pet', 'services', 'appointment', 'attend']

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
  const role = useAtomValue(roleAtom)

  const navigate = useNavigate()

  const { getVerifiedAppointments } = useClinic()

  const { data: allAppointments } = useQuery({
    queryKey: ['verified-appointments'],
    queryFn: getVerifiedAppointments,
  })

  if (!appointments || !user || !allAppointments) return null

  const previousEmptyObservations: Appointment[] = allAppointments.filter(
    ({ start_at, observations }) => {
      const { __typename, ...rest } = observations

      const isPrevious = dayjs(start_at).isBefore(appointments[0].start_at)

      return every(rest, isNull) && isPrevious
    }
  )

  const hasPreviousObservationsEmpty: boolean =
    previousEmptyObservations.length > 0

  return (
    <>
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

              {role !== Role.VETERINARIAN && (
                <VeterinaryCell
                  role={user.role}
                  veterinarian={Veterinarian}
                  appointmentId={id}
                />
              )}

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
                <IconButton
                  disabled={
                    role !== Role.VETERINARIAN
                    // !dayjs(start_at).isSame(dayjs(), 'day')
                  }
                  onClick={() => {
                    if (hasPreviousObservationsEmpty) {
                      // handleClick()
                      toast.error(`Tienes ${previousEmptyObservations.length} observaciones que llenar
          pendientes`)
                      return
                    }

                    navigate(id)
                  }}
                >
                  <FileOpenOutlined />
                </IconButton>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </>
  )
}

function VeterinaryCell(props: {
  role: Role
  veterinarian: Veterinarian
  appointmentId: string
}) {
  const { role, veterinarian, appointmentId } = props

  const { getMyEmployeesForSelect } = useClinic()
  const { t } = useTranslation()

  const employees = getMyEmployeesForSelect()
  const { reassignAppointment } = useClinic()
  const [veterinarianId, setVeterinarianId] = useState<string>(veterinarian.id)
  const [appointments, setAppointments] = useAtom(appointmentsAtom)
  const queryClient = useQueryClient()
  const { getMyEmployees } = useClinic()

  const { data: AllEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: getMyEmployees,
  })

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: ({
      appointmentId,
      veterinarianId,
    }: {
      appointmentId: string
      veterinarianId: string
    }) => reassignAppointment(appointmentId, veterinarianId),
  })

  if (!appointments) return

  return (
    <TableCell component='th' scope='row'>
      {role === 'CLINIC_OWNER' && employees ? (
        <div className='flex flex-row items-center gap-x-2'>
          <Select
            label={t('veterinary')}
            options={employees}
            value={veterinarianId}
            defaultValue={veterinarianId}
            onChange={(event: any) => {
              setVeterinarianId(event.target.value as string)
            }}
          />

          {isLoading ? (
            <CircularProgress />
          ) : (
            <IconButton
              disabled={veterinarianId === veterinarian.id}
              onClick={async () => {
                const response = await mutateAsync({
                  appointmentId,
                  veterinarianId,
                })

                setVeterinarianId(veterinarianId)

                const updatedAppointments = appointments.map((appointment) => {
                  if (!AllEmployees || appointment.id !== appointmentId)
                    return appointment

                  const newVeterinarian = AllEmployees.find(
                    ({ id_employee }) => {
                      return id_employee === veterinarianId
                    }
                  )

                  if (!newVeterinarian) return appointment

                  return {
                    ...appointment,
                    // @ts-ignore
                    Veterinarian: {
                      ...newVeterinarian.Employee,
                      id: newVeterinarian.id_employee,
                    } as Veterinarian,
                    id_veterinarian: veterinarianId,
                  }
                })

                setAppointments(updatedAppointments)

                toast.success(response.result)

                queryClient.invalidateQueries()
              }}
            >
              <SyncAltOutlined />
            </IconButton>
          )}
        </div>
      ) : (
        <Profile
          profile={`${veterinarian?.names} ${veterinarian?.surnames}`}
          image={veterinarian.image}
        />
      )}
    </TableCell>
  )
}
