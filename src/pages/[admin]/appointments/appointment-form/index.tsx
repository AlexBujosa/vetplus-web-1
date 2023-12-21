import { ChangeEvent, useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Appointment } from '@/types/clinic'
import TextField from '@mui/material/TextField'
import Button from '@/components/button'
import { Autocomplete, FormControl, MenuItem, Select } from '@mui/material'
import { useClinic } from '@/hooks/use-clinic'
import { useTranslation } from 'react-i18next'
import Image from '@/components/image'
import { Body, Title } from '@/components/typography'

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

interface AppointmentResume {
  id: string
  id_clinic: string
  id_owner: string
  observations: {
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

export default function AppointmentForm() {
  const { appointmentId } = useParams()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { updateAppointmentResumen } = useClinic()

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: updateAppointmentResumen,
  })

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setData({
      ...data,
      [name]: value,
    })
  }

  const [data, setData] = useState<FormData>({
    suffering: [],
    treatment: '',
    feed: '',
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

  const { id, id_clinic, id_owner, Owner, Pet } = appointment

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
      } catch (e) {
        console.log(e)
      }
    }
    onSubmit()
  }

  return (
    <section className='w-auto'>
      <Title.Medium text={t('clinic-history')} />

      <form className='pt-6'>
        <div className='flex gap-16 mb-4 flex-2'>
          <div className='flex-col py-2'>
            <p className='pb-1 font-semibold'>{t('owner')}</p>
            <div className='flex gap-2'>
              <Image
                src={Owner.image}
                className='w-10 h-10 rounded-full max-w-10'
              />
              <div className='pt-2'>{`${Owner.names} ${
                Owner.surnames ?? ''
              }`}</div>
            </div>
          </div>
          <div className='flex-col py-2'>
            <p className='pb-1 font-semibold'>{t('pet')}</p>
            <div className='flex gap-2'>
              <Image
                src={Pet.image}
                className='w-10 h-10 rounded-full max-w-10'
              />
              <div className='pt-2'>{Pet.name}</div>
            </div>
          </div>
        </div>
        <p className='py-4 font-bold'>{t('last-desparasitant')}</p>
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
              onChange={(e) =>
                handleVaccineChange('vaccineBrand', e.target.value)
              }
            />
          </div>
          <div className='mb-4'>
            <Body.Medium className='mb-2' text={t('batch')} />
            <TextField
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  height: '35px',
                  width: '20rem',
                },
              }}
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
        <div className='flex justify-end mt-8'>
          <Button
            onClick={handleSubmit}
            style={{
              borderRadius: '10px',
              height: '35px',
              width: '20rem',
              backgroundColor: '#239BCD',
            }}
          >
            {t('save-and-close')}
          </Button>
        </div>
      </form>
    </section>
  )
}
