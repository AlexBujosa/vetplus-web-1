import React from 'react'
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

export default function AppointmentDetail() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const appointments = useAtomValue(appointmentsAtom)

  if (!appointments) return null

  return (
    <>
      <Button onClick={() => navigate(routes.admin.pages.appointments.href)}>
        {t('go-back')}
      </Button>

      {/* <div>{JSON.stringify(appointments)}</div> */}

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Mascota</TableCell>
              <TableCell>Veterinario</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell>Cita</TableCell>
              <TableCell>Atender</TableCell>

              {/* <TableCell align='right'>Fat&nbsp;(g)</TableCell>
              <TableCell align='right'>Carbs&nbsp;(g)</TableCell>
              <TableCell align='right'>Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map(
              ({ id, Pet, start_at, end_at, Veterinarian, services }) => {
                // const appointmentTime = `${} - ${dayjs(end_at).format('hh mm')}`

                return (
                  <TableRow
                    key={id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align='right'>
                      <div className='flex flex-row items-center gap-x-3'>
                        <Image
                          className='w-10 h-10 rounded-full'
                          src={Pet.image}
                        />
                        {Pet.name}
                      </div>
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      {`${Veterinarian.names} ${Veterinarian.surnames}`}
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      {services.join(',')}
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      {dayjs(start_at).add(4, 'hour').format('hh:mm A')}
                    </TableCell>

                    <TableCell component='th' scope='row'>
                      <Button onClick={() => navigate(id)}>
                        <ReceiptLong />
                      </Button>
                    </TableCell>
                    {/* <TableCell align='right'>{row.fat}</TableCell>
                <TableCell align='right'>{row.carbs}</TableCell>
              <TableCell align='right'>{row.protein}</TableCell> */}
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
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
