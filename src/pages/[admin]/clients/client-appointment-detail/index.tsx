import { Appointment } from '@/types/clinic'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@mui/material'
import { KeyboardBackspace } from '@mui/icons-material'
import Image from '@/components/image'
import dayjs from 'dayjs'

export default function ClientAppointmentPage() {
  const params = useParams()
  const { t } = useTranslation()
  const client = useQueryClient()
  const navigate = useNavigate()
  const { appointmentId } = params

  const appointments: Appointment[] | undefined = client.getQueryData([
    'verified-appointments',
  ])

  if (!appointments) return navigate(-1)

  const appointment = appointments.find(({ id }) => {
    return id === appointmentId
  })

  if (!appointment) return navigate(-1)

  return (
    <div className='max-w-4xl mx-auto my-8'>
      <div className='flex items-center mb-6 space-x-4'>
        <IconButton
          onClick={() => navigate(-1)}
          children={<KeyboardBackspace className='text-black' />}
        />
        <h1 className='text-lg font-semibold'>Volver atrás</h1>
      </div>
      <div className='p-6 bg-white rounded-lg shadow'>
        <div className='grid grid-cols-1 gap-6 pb-6 mb-6 border-b md:grid-cols-2'>
          <div>
            <h2 className='mb-4 text-xl font-bold'>
              {t('appointment-details')}
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-x-3'>
                <span>
                  <p className='font-semibold'>{t('pet')}</p>
                  <p>{appointment.Pet.name}</p>
                </span>
                <Image
                  className='w-10 h-10 rounded-full'
                  src={appointment.Pet.image}
                />
              </div>
              <div className='flex items-center gap-x-3'>
                <span>
                  <p className='font-semibold'>{t('owner')}</p>
                  <p>
                    {appointment.Owner.surnames
                      ? `${appointment.Owner.names} ${appointment.Owner.surnames}`
                      : appointment.Owner.names}
                  </p>
                </span>
                <Image
                  className='w-10 h-10 rounded-full'
                  src={appointment.Owner.image}
                />
              </div>
              <div>
                <p className='font-semibold'>{t('start-at')}</p>
                <p>{dayjs(appointment.start_at).format('LLLL')}</p>
              </div>
              <div>
                <p className='font-semibold'>{t('end-at')}</p>
                <p>
                  {appointment.end_at
                    ? dayjs(appointment.end_at).format('LLLL')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='font-semibold'>{t('last-deworming')}</p>
                <p>{t('date')}</p>
                <p>
                  {dayjs(appointment.observations.deworming.date).format(
                    'LLLL'
                  )}
                </p>
              </div>
              <div>
                <p className='font-semibold'>{t('product')}</p>
                <p>{appointment.observations.deworming.product}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6 pb-6 mb-6 border-b md:grid-cols-2'>
          <div>
            <h2 className='mb-4 text-xl font-bold'>{t('vaccines')}</h2>
            <p className='font-semibold'>
              {t('brand')}: {appointment.observations.vaccines.vaccineBrand}
            </p>
            <p>
              {t('batch')}: {appointment.observations.vaccines.vaccineBatch}
            </p>
          </div>

          {appointment.observations.reproductiveTimeline && (
            <div className='p-4 border'>
              <h2 className='mb-2 text-lg font-bold'>
                {t('reproductive-history')}
              </h2>
              {appointment.observations.reproductiveTimeline.dateLastHeat && (
                <p>
                  {t('last-heat-date')}:{' '}
                  {dayjs(
                    appointment.observations.reproductiveTimeline.dateLastHeat
                  ).format('LLL')}
                </p>
              )}

              {appointment.observations.reproductiveTimeline.dateLastBirth && (
                <p>
                  {t('date-last-birth')}:{' '}
                  {dayjs(
                    appointment.observations.reproductiveTimeline.dateLastBirth
                  ).format('LLL')}
                </p>
              )}
            </div>
          )}
        </div>

        {appointment.observations.suffering.length > 0 && (
          <div>
            <h2 className='mb-4 text-xl font-bold'>{t('suffering')}</h2>
            <ul className='pl-5 list-disc'>
              {appointment.observations.suffering.map((suffering) => {
                return <li key={suffering}>{suffering}</li>
              })}
            </ul>
          </div>
        )}

        {appointment.observations.treatment && (
          <div>
            <h2 className='mb-4 text-xl font-bold'>{t('treatments')}</h2>
            <ul className='pl-5 list-disc'>
              {appointment.observations.treatment}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
