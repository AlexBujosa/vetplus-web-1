import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Appointment } from '@/types/clinic'
import TextField from '@mui/material/TextField'
import Button from '@/components/button'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { routes } from '@/config/routes'
import { useTranslation } from 'react-i18next'

export default function AppointmentForm() {
  const { appointmentId } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log(formData)
  }

  const [formData, setFormData] = useState({
    diagnosticos: '',
    tratamientos: '',
    medicamentos: '',
    resultadosPruebas: '',
    peso: '',
    vacunas: '',
    recurrencia: '',
  })

  const appointments: Appointment[] | undefined = queryClient.getQueryData([
    'appointments',
  ])

  if (!appointments) return null

  const appointment = appointments.filter(({ id }) => {
    return id === appointmentId
  })

  if (!appointment) return null

  return (
    <>
      <Button onClick={() => navigate(routes.admin.pages.appointments.href)}>
        {t('go-back')}
      </Button>

      <form onSubmit={handleSubmit}>
        <TextField
          label='Diagnosticos'
          name='diagnosticos'
          value={formData.diagnosticos}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Tratamientos y procesos administrados'
          name='tratamientos'
          value={formData.tratamientos}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Medicamentos recetados'
          name='medicamentos'
          value={formData.medicamentos}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Resultados de pruebas medicas'
          name='resultadosPruebas'
          value={formData.resultadosPruebas}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Peso'
          name='peso'
          value={formData.peso}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Vacunas'
          name='vacunas'
          value={formData.vacunas}
          onChange={handleChange}
          fullWidth
          margin='normal'
        />

        <FormControl fullWidth>
          <InputLabel id='recurrencia-label'>Recurrencia</InputLabel>
          <Select
            labelId='recurrencia-label'
            id='recurrencia'
            name='recurrencia'
            value={formData.recurrencia}
            onChange={handleChange}
          >
            <MenuItem value='Si'>Si</MenuItem>
            <MenuItem value='No'>No</MenuItem>
          </Select>
        </FormControl>
        <br></br>

        <Button type='submit'>Submit</Button>
      </form>
    </>
  )
}
