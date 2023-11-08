import React, { useState } from 'react'
import Input from '@/components/input'
import { Body, Title } from '@/components/typography'
import { AddOutlined, SearchOutlined } from '@mui/icons-material'
import { Box, InputAdornment, Skeleton, Modal as MuiModal } from '@mui/material'
import Table, { Row } from '@/components/table'
import { useClinic } from '@/hooks/use-clinic'
import StarsReview from '@/components/stars-review'
import { Profile } from '@/components/profile'
import StatusBadge from '@/components/status-badge'
import { Employee } from '@/hooks/use-clinic/employeesAtom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/button'
import Modal from '@/components/molecules/modal'
import * as yup from 'yup'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'

const schema = yup.object({
  email: yup.string().email().required(),
})

const initialValues = {
  email: '',
}

export default function EmployeesPage() {
  const { t } = useTranslation()
  const { sendInvitationToClinic } = useClinic()

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const onSubmit = async (data: { email: string }) => {
    try {
      await sendInvitationToClinic(data.email)
      toast.success('Invitation was succesfull')
      handleClose()
    } catch (error: any) {
      toast.error(t('something-wrong'))
      console.error(error.message)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit,
  })

  return (
    <>
      <Title.Large text={t('employees')} />

      <div className='flex flex-row items-center justify-between'>
        <Input
          className='w-[300px] bg-white text-base-neutral-gray-700 shadow-elevation-1'
          variant='outlined'
          placeholder={t('search-employees')}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type='submit'
          size='small'
          icon={<AddOutlined />}
          label={t('invite-employee')}
          onClick={handleOpen}
        />
      </div>

      <EmployeesTable />

      <MuiModal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Modal title={t('invite-employee')}>
            <article className='py-4'>
              <form
                onSubmit={formik.handleSubmit}
                className='flex flex-row items-center justify-between'
              >
                <Input
                  name='email'
                  label={t('email')}
                  variant='outlined'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                <button type='submit'>{t('send-invitation')}</button>
              </form>
            </article>
          </Modal>
        </Box>
      </MuiModal>
    </>
  )
}

function EmployeesTable() {
  const { t } = useTranslation()
  const columns = [
    t('name'),
    t('email'),
    t('speciality'),
    t('status'),
    t('review'),
  ]

  const { getMyEmployees } = useClinic()
  const { data, isLoading: loading } = useQuery({
    queryKey: ['employees'],
    queryFn: getMyEmployees,
  })

  const rows = loading ? TableLoadingRows() : EmployeesRowsValues(data ?? [])

  function TableLoadingRows(): Row[] {
    return [
      {
        key: '',
        values: [...Array(columns.length)].map(() => <Skeleton />),
      },
    ]
  }

  return <Table columns={columns} rows={rows} />
}

function EmployeesRowsValues(employees: Employee[]): Row[] {
  return employees.map((employee) => {
    const { fullName, email, specialty, status, score, image } = employee

    const values = [
      <Profile profile={fullName} image={image} />,
      <Body.Medium className='text-base-neutral-gray-900' text={email} />,
      <Body.Medium className='text-base-neutral-gray-900' text={specialty} />,
      <StatusBadge status={status} />,
      <StarsReview review={score} />,
    ]

    return {
      key: email,
      values,
    }
  })
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
}
