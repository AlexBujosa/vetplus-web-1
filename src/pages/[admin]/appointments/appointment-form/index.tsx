import React, { useState } from 'react'
import { useFormik } from 'formik'
import Input from '@/components/input'
import { Profile } from '@/components/profile'
import { IconButton, MenuItem, Select } from '@mui/material'
import Button from '@/components/button'
import { Badge } from '@/components/badge'
import { Body, Title } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { KeyboardBackspace } from '@mui/icons-material'
import { routes } from '@/config/routes'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import { useClinic } from '@/hooks/use-clinic'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppointmentForm } from '@/types/clinic'
import toast from 'react-hot-toast'
import { useAtom } from 'jotai'
import { appointmentsAtom } from '@/hooks/use-clinic/appointmentsAtom'

const options = [
  '',
  'Alergias cutáneas',
  'Bronquitis',
  'Dermatitis',
  'Diabetes',
  'Infección ORL',
  'Infección cutánea',
  'Infección ocular',
  'Infección respiratoria',
  'Parásitos',
  'Problemas dentales',
  'Problemas digestivos',
  'Traumatismos/lesiones',
]

export default function Form() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { appointmentId } = useParams()
  const [appointments, setAppointments] = useAtom(appointmentsAtom)
  const queryClient = useQueryClient()

  if (!appointments) return null

  const appointment = appointments.find(({ id }) => id === appointmentId)

  if (!appointment) return null

  const addSuffering = (selectedSuffering: string) => {
    setSuffering((prevSuffering) => [...prevSuffering, selectedSuffering])
    formik.setFieldValue('suffering', [...suffering, selectedSuffering])
  }

  const removeSuffering = (removedSuffering: string) => {
    setSuffering((prevSuffering) =>
      prevSuffering.filter((item) => item !== removedSuffering)
    )

    formik.setFieldValue(
      'suffering',
      suffering.filter((item) => item !== removedSuffering)
    )
  }

  const { treatment, feed, deworming, reproductiveTimeline, vaccines } =
    appointment.observations

  const [suffering, setSuffering] = useState<string[]>(
    appointment.observations.suffering ?? []
  )

  const [reproductiveHistory, setReproductiveHistory] = useState<string>(
    appointment.observations.reproductiveTimeline.reproductiveHistory ?? ''
  )

  const initialValues = {
    suffering: appointment.observations.suffering,
    treatment,
    feed,
    deworming: {
      date: dayjs(deworming.date),
      product: deworming.product,
    },
    reproductiveTimeline: {
      reproductiveHistory: reproductiveTimeline.reproductiveHistory,
      dateLastHeat: dayjs(reproductiveTimeline.dateLastHeat),
      dateLastBirth: dayjs(reproductiveTimeline.dateLastBirth),
    },
    vaccines: {
      date: dayjs(vaccines.date),
      vaccineBrand: vaccines.vaccineBrand,
      vaccineBatch: vaccines.vaccineBatch,
    },
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
  })

  const { updateAppointmentResumen } = useClinic()

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: (data: AppointmentForm) =>
      updateAppointmentResumen(data, appointment),
  })

  async function onSubmit(values: any) {
    try {
      await mutateAsync({ ...values })

      if (!appointment || !appointments) return

      const updatedAppointment = appointment

      const updatedAppointments = appointments

      const newAppointmentIndex = appointments.findIndex((appointment) => {
        return appointment.id === updatedAppointment.id
      })

      if (newAppointmentIndex === -1) return

      const newAppointment = updatedAppointments[newAppointmentIndex]
      newAppointment.observations = values

      setAppointments(updatedAppointments)

      toast.success(t('updated-fields'))
      queryClient.invalidateQueries()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <section className='flex items-center gap-x-3'>
        <IconButton
          className='w-fit'
          onClick={() =>
            navigate(routes.admin.pages['appointment-detail'].href)
          }
        >
          <KeyboardBackspace />
        </IconButton>
        <Title.Medium text={t('go-back')} />
      </section>

      <div className='p-6 bg-white rounded-lg shadow-elevation-1'>
        <Title.Medium
          text='Historial Clínico'
          className='text-lg font-medium leading-6 text-gray-900'
        />

        <form onSubmit={formik.handleSubmit} className='grid grid-cols-3 gap-6'>
          <section className='flex col-span-3 gap-x-12 w-fit'>
            <div className='flex flex-col gap-y-3'>
              <Body.Large
                text={t('owner')}
                className='text-sm font-medium text-gray-700'
              />
              <div className='flex items-center'>
                <Profile
                  profile={`${appointment?.Owner.names} ${
                    appointment?.Owner.surnames ?? ''
                  }`}
                  image={appointment?.Owner.image}
                />
              </div>
            </div>
            <div className='flex flex-col gap-y-3'>
              <Body.Large text={t('pet')} />
              <div className='flex items-center'>
                <Profile
                  image={appointment?.Pet.image}
                  profile={appointment?.Pet.name ?? ''}
                />
              </div>
            </div>
          </section>

          <div className='mt-4'>
            <Body.Large text={t('last-deworming')} />
            <div className='flex mt-1'>
              <div className='w-full pr-1'>
                <Body.Medium text={t('date')} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      format='DD-MM-YYYY'
                      value={formik.values.deworming.date}
                      onChange={(date) =>
                        formik.setFieldValue(
                          'deworming.date',
                          dayjs(date).format('YYYY-MM-DD')
                        )
                      }
                      componentsProps={{
                        actionBar: {
                          actions: ['clear'],
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>

              <div className='w-full pl-1'>
                <Body.Medium text={t('product')} />
                <Input
                  name='deworming.product'
                  value={formik.values.deworming.product}
                  onChange={formik.handleChange}
                  placeholder='Producto 1'
                  variant='outlined'
                />
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <Body.Large text={t('vaccines')} />

            <div className='flex mt-1'>
              <div className='w-full pr-1'>
                <Body.Large text={t('date')} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      format='DD-MM-YYYY'
                      value={formik.values.vaccines.date}
                      onChange={(date) =>
                        formik.setFieldValue(
                          'vaccines.date',
                          dayjs(date).format('YYYY-MM-DD')
                        )
                      }
                      componentsProps={{
                        actionBar: {
                          actions: ['clear'],
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className='w-full pl-1'>
                <Body.Large text={t('product')} />
                <Input
                  name='vaccines.vaccineBrand'
                  value={formik.values.vaccines.vaccineBrand}
                  onChange={formik.handleChange}
                  variant='outlined'
                  placeholder='Nombre de vacuna'
                />

                <Body.Large text={t('batch')} />
                <Input
                  name='vaccines.vaccineBatch'
                  value={formik.values.vaccines.vaccineBatch}
                  onChange={formik.handleChange}
                  variant='outlined'
                  placeholder='Lote de vacuna'
                />
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <Body.Large text={t('suffering')} />
            <div className='flex flex-col flex-wrap gap-2 mt-1'>
              <section className='flex gap-x-2'>
                {suffering.map((item) => (
                  <Badge
                    key={item}
                    className='select-none h-fit bg-base-primary-100 hover:bg-base-primary-200'
                    label={item}
                    onClick={() => removeSuffering(item)}
                  />
                ))}
              </section>

              <Select
                value={suffering}
                label='Padecimientos'
                onChange={(event) => {
                  const selectedValue = event.target.value as string
                  addSuffering(selectedValue)
                }}
              >
                {options.map((option) => {
                  return (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )
                })}
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 mt-4'>
            <div>
              <Body.Large text={t('treatments')} />
              <Input
                variant='outlined'
                name='treatment'
                value={formik.values.treatment}
                onChange={formik.handleChange}
                placeholder='Uso de champús.'
              />
            </div>
            <div className='mt-4'>
              <Body.Large text={t('feeding')} />
              <Input
                variant='outlined'
                name='feed'
                value={formik.values.feed}
                onChange={formik.handleChange}
                placeholder='Proporciona heno de alta calidad como base de la dieta para conejos y roedores.'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 mt-4'>
            <div>
              <Body.Large text={t('date-last-birth')} />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format='DD-MM-YYYY'
                    value={formik.values.reproductiveTimeline.dateLastBirth}
                    onChange={(date) =>
                      formik.setFieldValue(
                        'reproductiveTimeline.dateLastBirth',
                        dayjs(date).format('YYYY-MM-DD')
                      )
                    }
                    componentsProps={{
                      actionBar: {
                        actions: ['clear'],
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className='mt-4'>
              <Body.Large text={t('last-heat-date')} />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format='DD-MM-YYYY'
                    value={formik.values.reproductiveTimeline.dateLastHeat}
                    onChange={(date) =>
                      formik.setFieldValue(
                        'reproductiveTimeline.dateLastHeat',
                        dayjs(date).format('YYYY-MM-DD')
                      )
                    }
                    componentsProps={{
                      actionBar: {
                        actions: ['clear'],
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>

          <div>
            <Body.Large text={t('reproductive-history')} />
            <Select
              value={reproductiveHistory}
              name='reproductive-history'
              label='reproductive-history'
              onChange={(event) => {
                const selectedValue = event.target.value as string
                setReproductiveHistory(selectedValue)
                formik.setFieldValue(
                  'reproductiveTimeline.reproductiveHistory',
                  selectedValue
                )
              }}
              defaultValue='N/A'
            >
              <MenuItem value='N/A'>N/A</MenuItem>
              <MenuItem value='Entero'>Entero</MenuItem>
              <MenuItem value='Esterilizado'>Esterilizado</MenuItem>
            </Select>
          </div>

          <Button
            type='submit'
            className='col-span-2 text-white bg-base-primary-600'
            label='Guardar y Cerrar'
            loading={isLoading}
          />
        </form>
      </div>
    </>
  )
}
