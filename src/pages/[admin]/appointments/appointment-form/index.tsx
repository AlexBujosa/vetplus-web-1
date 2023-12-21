import { ChangeEvent, useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Appointment, AppointmentForm } from '@/types/clinic'
import TextField from '@mui/material/TextField'
import Button from '@/components/button'
import { Autocomplete, FormControl, MenuItem, Select } from '@mui/material'
import { useClinic } from '@/hooks/use-clinic'
import { useTranslation } from 'react-i18next'
import { Body, Title } from '@/components/typography'
import { Profile } from '@/components/profile'
import toast from 'react-hot-toast'

interface FormData {
  suffering: string[]
  treatment: string
  feed: string
  deworming: {
    date: string
    product: string
  }
  reproductiveTimeline: {
    reproductiveHistory: string
    dateLastHeat: string
    dateLastBirth: string
  }
  vaccines: {
    date: string
    vaccineBrand: string
    vaccineBatch: string
  }
}

const options = [
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
  const { appointmentId } = useParams()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { updateAppointmentResumen } = useClinic()

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: (payload: AppointmentForm) => updateAppointmentResumen(payload),
  })

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setData({
      ...data,
      [name]: value,
    })
  }

  const [appointmentResume, setAppointmentResume] = useState({})

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleDewormingChange = (field: 'date' | 'product', value: string) => {
    setData((prevData) => ({
      ...prevData,
      deworming: {
        ...prevData.deworming,
        [field]: value,
      },
    }))
  }

  const handleVaccineChange = (
    field: 'date' | 'vaccineBrand' | 'vaccineBatch',
    value: string
  ) => {
    setData((prevData) => ({
      ...prevData,
      vaccines: {
        ...prevData.vaccines,
        [field]: value,
      },
    }))
  }

  const handleSufferingChange = (
    event: ChangeEvent<any>,
    newValue: string[]
  ) => {
    setSelectedOptions(newValue)
    setData({
      ...data,
      suffering: newValue,
    })
  }

  const appointments: Appointment[] | undefined = queryClient.getQueryData([
    'appointments',
  ])

  if (!appointments) return null

  const appointment = appointments.find(({ id }) => {
    return id === appointmentId
  })

  if (!appointment) return null

  const { id, id_clinic, id_owner, Owner, Pet, observations } = appointment

  const { feed, treatment } = observations

  const [data, setData] = useState<FormData>({
    suffering: [],
    treatment,
    feed,
    deworming: {
      date: '',
      product: '',
    },
    reproductiveTimeline: {
      reproductiveHistory: 'Entero',
      dateLastHeat: '',
      dateLastBirth: '',
    },
    vaccines: {
      date: '',
      vaccineBrand: '',
      vaccineBatch: '',
    },
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const {
      suffering,
      treatment,
      feed,
      deworming,
      vaccines,
      reproductiveTimeline,
    } = data

    const newAppointmentResume = {
      id,
      id_clinic,
      id_owner,
      observations: {
        suffering,
        treatment,
        feed,
        deworming,
        vaccines,
        reproductiveTimeline,
      },
    }

    setAppointmentResume(newAppointmentResume)

    const onSubmit = async () => {
      try {
        await mutateAsync({ ...newAppointmentResume })
        queryClient.invalidateQueries({
          queryKey: ['appointments'],
        })
        toast.success(t('updated-fields'))
      } catch (e) {
        toast.error('Something bad happened at updating the appointment data')
        console.error(e)
      }
    }
    onSubmit()
  }

  return (
    <section className='w-auto'>
      <Title.Large text={t('clinic-history')} />

      <form className='pt-6'>
        <div className='flex gap-16 mb-4 flex-2'>
          <div className='flex-col py-2'>
            <Body.Large className='mb-2' text={t('owner')} />
            <Profile
              image={Owner.image}
              profile={`${Owner.names} ${Owner.surnames ?? ''}`}
            />
          </div>
          <div className='flex-col py-2'>
            <Body.Large className='mb-2' text={t('pet')} />
            <Profile image={Pet.image} profile={Pet.name} />
          </div>
        </div>

        <Title.Medium className='py-4' text={t('last-desparasitant')} />

        <div className='flex gap-16 mb-4'>
          <div>
            <Body.Large className='mb-2' text={t('date')} />
            <TextField
              type='date'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
              value={data.deworming.date}
              onChange={(e) => handleDewormingChange('date', e.target.value)}
            />
          </div>
          <div>
            <Body.Large className='mb-2' text={t('product')} />
            <TextField
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
              value={data.deworming.product}
              onChange={(e) => handleDewormingChange('product', e.target.value)}
            />
          </div>
          <div>
            <Body.Large className='mb-2' text={t('reproductive-history')} />

            <FormControl
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '15rem',
                },
              }}
            >
              <Select
                value={data.reproductiveTimeline.reproductiveHistory}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    height: '10px',
                    width: '15rem',
                  },
                }}
                onChange={(e) => {
                  setData({
                    ...data,
                    reproductiveTimeline: {
                      ...data.reproductiveTimeline,
                      reproductiveHistory: e.target.value as string,
                    },
                  })
                }}
              >
                <MenuItem
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '15px',
                      width: '15rem',
                    },
                  }}
                  value='Entero'
                >
                  Entero
                </MenuItem>
                <MenuItem
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '15px',
                      width: '15rem',
                    },
                  }}
                  value='Esterilizado'
                >
                  Esterilizado
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <p className='mb-4 font-bold'>{t('vaccines')}</p>
        <div className='flex gap-16'>
          <div className='mb-4'>
            <Body.Large className='mb-2' text={t('date')} />
            <TextField
              type='date'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
              value={data.vaccines.date}
              onChange={(e) => handleVaccineChange('date', e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <Body.Large className='mb-2' text={t('brand')} />
            <TextField
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
              value={data.vaccines.vaccineBrand}
              onChange={(e) =>
                handleVaccineChange('vaccineBrand', e.target.value)
              }
            />
          </div>
          <div className='mb-4'>
            <Body.Large className='mb-2' text={t('batch')} />
            <TextField
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
              value={data.vaccines.vaccineBatch}
              onChange={(e) =>
                handleVaccineChange('vaccineBatch', e.target.value)
              }
            />
          </div>
        </div>
        <div className='py-4'>
          <Body.Large className='mb-2' text={t('ailments')} />
          <Autocomplete
            multiple
            options={options}
            value={selectedOptions}
            onChange={handleSufferingChange}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder='Select options'
                variant='outlined'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    width: '40rem',
                  },
                }}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li
                {...props}
                style={{ backgroundColor: selected ? 'lightblue' : 'white' }}
              >
                {option}
              </li>
            )}
          />
        </div>
        <div className='flex gap-16 py-4'>
          <div>
            <Body.Large className='mb-2' text={t('treatments')} />
            <TextField
              value={data.treatment}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '55px',
                  width: '25rem',
                },
              }}
              onChange={(e) => {
                setData({ ...data, treatment: e.target.value })
              }}
            />
          </div>
          <div>
            <Body.Large className='mb-2' text={t('feeding')} />
            <TextField
              value={data.feed}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '55px',
                  width: '25rem',
                },
              }}
              onChange={(e) => {
                setData({ ...data, feed: e.target.value })
              }}
            />
          </div>
        </div>
        <div className='flex gap-16 pt-8'>
          <div>
            <Body.Large className='mb-2' text={t('date-last-birth')} />
            <TextField
              type='date'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
              onChange={(e) => {
                setData({
                  ...data,
                  reproductiveTimeline: {
                    ...data.reproductiveTimeline,
                    dateLastBirth: e.target.value,
                  },
                })
              }}
            />
          </div>
          <div>
            <Body.Large className='mb-2' text={t('last-heat-date')} />
            <TextField
              type='date'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
              onChange={(e) => {
                setData({
                  ...data,
                  reproductiveTimeline: {
                    ...data.reproductiveTimeline,
                    dateLastHeat: e.target.value,
                  },
                })
              }}
            />
          </div>
        </div>
        <div className='flex mt-8 gap-x-3'>
          <Button className='bg-base-primary-400' onClick={handleSubmit}>
            {t('save-and-close')}
          </Button>

          <Button
            className='bg-base-semantic-danger-500 hover:bg-base-semantic-danger-600'
            // onClick={handleSubmit}
          >
            {t('end-appointment')}
          </Button>
        </div>
      </form>
    </section>
  )
}
