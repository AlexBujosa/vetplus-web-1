import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import StatusBadge from '@/components/status-badge'
import { Headline, Body, Title } from '@/components/typography'
import { routes } from '@/config/routes'
import { KeyboardBackspace } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ProfileWithRole } from '../../profile'
import { Pet } from '@/types/pet'
import Image from '@/components/image'
import { useClinic } from '@/hooks/use-clinic'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Appointment,
  AppointmentState,
  AppointmentStatus,
} from '@/types/clinic'
import {
  Table,
  TableBody,
  IconButton,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Badge } from '@/components/badge'
import cn from '@/utils/cn'
import { Dispatch, SetStateAction, useState } from 'react'

dayjs.extend(relativeTime)

export default function ClientsDetailPage() {
  const params = useParams()
  const client = useQueryClient()
  const { email: clientEmail } = params

  const [pet, setPet] = useState<Pet | undefined>(undefined)

  const clinicClients: any[] | undefined = client.getQueryData(['clients'])

  if (!clinicClients) return null

  const clinicClient = clinicClients.find(({ User }) => {
    const { email } = User
    return email === clientEmail
  })

  const { getVerifiedAppointments } = useClinic()

  const { data: allAppointments } = useQuery({
    queryKey: ['verified-appointments'],
    queryFn: getVerifiedAppointments,
  })

  const clientAppointments = allAppointments?.filter(({ id_owner }) => {
    return id_owner === clinicClient.id_user
  })

  return (
    <div>
      <ClientHeader client={clinicClient.User} />

      <section className='grid grid-cols-2 gap-x-3 gap-y-6'>
        <GeneralDescription client={clinicClient} />
        <ClientPets
          pets={clinicClient.User.Pet}
          haveAppointments={
            clientAppointments ? clientAppointments.length > 0 : undefined
          }
          setPet={setPet}
          actualPet={pet}
        />
        {clientAppointments && clientAppointments.length > 0 && (
          <ClientAppointments appointments={clientAppointments} pet={pet} />
        )}
      </section>
    </div>
  )
}

function ClientHeader({ client }: { client: any }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const fullName = client.surnames
    ? `${client.names} ${client.surnames}`
    : client.names

  return (
    <section className='flex flex-col mb-10 gap-y-7'>
      <div className='flex flex-row gap-x-[20px]'>
        <IconButton
          onClick={() => navigate(routes.admin.pages.clients.href)}
          children={<KeyboardBackspace className='text-black' />}
        />
        <Headline.Medium text={fullName} />
      </div>

      <div className='flex flex-row items-center justify-between gap-x-5'>
        <ProfileWithRole image={client.image} role={t('pet-owner')} />
      </div>
    </section>
  )
}

function GeneralDescription({ client }: { client: any }) {
  const { email, telephone_number, address, status } = client.User
  const { t } = useTranslation()

  const data: Record<string, JSX.Element> = {
    [t('email')]: <Typography text={email} />,
    [t('telephone-number')]: <Typography text={telephone_number} />,
    [t('address')]: <Typography text={address} />,
    // [t('review')]: <StarsReview review={score} />,
    [t('status')]: <StatusBadge status={status} />,
  }

  return (
    <div className='grid col-span-1 bg-white rounded-lg shadow-elevation-1'>
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

function ClientPets(props: {
  pets: Pet[]
  haveAppointments: boolean | undefined
  setPet: Dispatch<SetStateAction<Pet | undefined>>
  actualPet: Pet | undefined
}) {
  const { t } = useTranslation()
  const { pets, setPet, actualPet, haveAppointments } = props

  const { getAllBreeds } = useClinic()

  const { data: breeds } = useQuery({
    queryKey: ['breeds'],
    queryFn: getAllBreeds,
  })

  return (
    <div className='grid bg-white rounded-lg shadow-elevation-1'>
      <div className='px-[30px] py-[15px] border-b border-b-neutral-gray-500 h-fit'>
        <Title.Medium className='font-semibold' text={t('pets')} />
      </div>

      <div className='flex flex-col rounded-lg mt-7 max-h-[200px] overflow-y-scroll'>
        {pets.map((pet) => {
          const { id, image, name, id_breed, dob, gender } = pet

          const breed = breeds?.find((breed: any) => {
            return breed.id === id_breed
          })

          const isActualPet = actualPet?.id === id

          return (
            <div
              className={cn(
                'grid px-[30px] grid-cols-5 py-3 hover:bg-base-neutral-gray-300 select-none',
                haveAppointments &&
                  isActualPet &&
                  'bg-base-primary-200 hover:bg-base-primary-200'
              )}
              key={id}
              onClick={() => {
                if (isActualPet) {
                  return setPet(undefined)
                }

                setPet(pet)
              }}
            >
              <Image className='w-10 h-10 rounded-full' src={image} />
              <span>
                <Body.Large text={t('name')} />
                <Body.Medium
                  className='font-normal text-base-neutral-gray-800'
                  text={name}
                />
              </span>

              <span>
                <Body.Large text={t('breed')} />
                <Body.Medium
                  className='font-normal text-base-neutral-gray-800'
                  text={breed?.name ?? 'N/A'}
                />
              </span>

              <span>
                <Body.Large text={t('age')} />
                <Body.Medium
                  className='font-normal text-base-neutral-gray-800'
                  text={calculateYears(dob) ?? 'N/A'}
                />
              </span>

              <span>
                <Body.Large text={t('sex')} />
                <Body.Medium
                  className='font-normal text-base-neutral-gray-800'
                  text={gender}
                />
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ClientAppointments(props: { appointments: Appointment[]; pet?: Pet }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  let { appointments, pet } = props

  if (pet !== undefined) {
    appointments = appointments.filter(({ id_pet }) => {
      return pet?.id === id_pet
    })
  }

  return (
    <div className='grid col-span-2 bg-white rounded-lg shadow-elevation-1'>
      <TableContainer style={{ maxHeight: 400 }}>
        <Table aria-label='simple table' stickyHeader>
          <Header
            headers={[
              t('veterinary-clinic'),
              t('veterinary'),
              t('services'),
              t('status'),
              t('date'),
            ]}
          />

          <TableBody>
            {appointments.length === 0 ? (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell colSpan={5} align='left'>
                  No hay citas
                </TableCell>
              </TableRow>
            ) : (
              appointments.map(
                ({
                  id,
                  Clinic,
                  Veterinarian,
                  services,
                  start_at,
                  end_at,
                  state,
                  appointment_status,
                }) => {
                  const status: AppointmentStatus | AppointmentState =
                    appointment_status === AppointmentStatus.DENIED
                      ? t('cancelled')
                      : state

                  const statusColor =
                    appointment_status === AppointmentStatus.DENIED
                      ? 'bg-base-semantic-danger-500'
                      : state === AppointmentState.FINISHED
                      ? 'bg-base-semantic-success-500'
                      : state === AppointmentState.PENDING
                      ? 'bg-base-semantic-warning-500'
                      : state === AppointmentState.IN_PROGRESS
                      ? 'bg-base-semantic-primary-500'
                      : state === AppointmentState.DELAYED &&
                        'bg-base-semantic-orange-500'

                  return (
                    <TableRow
                      key={id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      className={cn(
                        'hover:bg-base-neutral-gray-300',
                        state === AppointmentState.FINISHED &&
                          'hover:cursor-pointer'
                      )}
                      onClick={() => {
                        if (state !== AppointmentState.FINISHED) return

                        navigate(`/client-appointment/${id}`)
                      }}
                    >
                      <TableCell align='right'>
                        <div className='flex flex-row items-center gap-x-3'>
                          <Image
                            className='w-10 h-10 rounded-full'
                            src={Clinic.image}
                          />
                          {Clinic.name}
                        </div>
                      </TableCell>

                      <TableCell component='th' scope='row'>
                        {Veterinarian ? (
                          <div className='flex flex-row items-center gap-x-3'>
                            <Image
                              className='w-10 h-10 rounded-full'
                              src={Veterinarian?.image}
                            />
                            {Veterinarian.surnames
                              ? `${Veterinarian.names} ${Veterinarian.surnames}`
                              : Veterinarian.names}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>

                      <TableCell component='th' scope='row'>
                        {services ? (
                          <div className='flex flex-row items-center gap-x-3'>
                            {services.map((service) => {
                              return (
                                <Badge
                                  key={service}
                                  label={service}
                                  className='font-bold text-white bg-base-primary-600'
                                />
                              )
                            })}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>

                      <TableCell component='th' scope='row'>
                        <Badge
                          className={cn('text-white', statusColor)}
                          label={status}
                        />
                      </TableCell>

                      <TableCell component='th' scope='row'>
                        {end_at
                          ? `${dayjs(start_at).format('LLL')} - ${dayjs(
                              end_at
                            ).format('hh:mm A')}`
                          : dayjs(start_at).format('LLL')}
                      </TableCell>
                    </TableRow>
                  )
                }
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
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

const calculateYears = (dob?: Date): string | undefined => {
  const { t } = useTranslation()

  if (!dob) return undefined

  const currentDate = new Date()
  const birthDate = new Date(dob)

  let age = currentDate.getFullYear() - birthDate.getFullYear()

  // Check if the birthday has occurred this year
  const hasBirthdayOccurred =
    currentDate.getMonth() > birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() >= birthDate.getDate())

  // If birthday hasn't occurred yet this year, subtract 1 from the age
  if (!hasBirthdayOccurred) {
    age--
  }

  if (age === 0) return dayjs(dob).fromNow()

  return `${age.toString()} ${t('years')}`
}

function Header(props: { headers: string[] }) {
  const { headers } = props

  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => {
          return (
            <TableCell key={header} sx={{ width: 1 / headers.length }}>
              {header}
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}
