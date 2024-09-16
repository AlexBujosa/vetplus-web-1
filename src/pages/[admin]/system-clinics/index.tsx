import * as React from 'react'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Title } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useClinic } from '@/hooks/use-clinic'
import Button from '@/components/button'
import { Modal as MuiModal } from '@mui/material'
import Modal from '@/components/molecules/modal'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Input from '@/components/input'
import { useDropzone } from 'react-dropzone'
import { Picture } from '../clinic/general-info'
import { CloudUploadOutlined } from '@mui/icons-material'
import { isEqual } from 'lodash'
import useUser from '@/hooks/use-user'
import { Role } from '@/types/role'
import _ from 'lodash'

export default function SystemClinics() {
  const [rows, setRows] = React.useState([])
  const [open, setOpen] = React.useState<boolean>(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { getAllClinics, updateClinicByAdmin } = useClinic()

  const { isLoading } = useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      const data = await getAllClinics()
      setRows(data)
      return data
    },
  })

  const { mutateAsync } = useMutation({
    mutationFn: updateClinicByAdmin,
  })

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    // @ts-ignore
    const editedRow = rows.find((row) => row.id === id)
    // @ts-ignore
    if (editedRow!.isNew) {
      // @ts-ignore
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const processRowUpdate = async (newRow: GridRowModel) => {
    const {
      ClinicSummaryScore,
      created_at,
      updated_at,
      id_owner,
      __typename,
      ...rest
    } = newRow
    // @ts-ignore
    // console.log({ ...rest })
    toast.promise(mutateAsync({ ...rest, id: id_owner }), {
      success: t('updated-fields'),
      loading: t('loading'),
      error: t('something-wrong'),
    })
    // @ts-ignore
    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)))
    return newRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const { t } = useTranslation()

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      align: 'left',
      headerAlign: 'left',
    },
    { field: 'id_owner', headerName: 'Owner Id', width: 100 },
    {
      editable: true,
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    { editable: true, field: 'email', headerName: 'Email', width: 200 },
    { editable: true, field: 'address', headerName: 'Address', width: 100 },
    {
      editable: true,
      field: 'google_maps_url',
      headerName: 'Google Maps Url',
      width: 100,
    },
    {
      editable: true,
      field: 'image',
      headerName: 'Image',
      width: 100,
    },
    {
      editable: true,
      field: 'services',
      headerName: 'Services',
      width: 100,
    },
    {
      editable: true,
      field: 'telephone_number',
      headerName: 'Telephone Number',
      width: 100,
    },
    { field: 'created_at', headerName: 'Created At', width: 150 },
    {
      editable: true,
      field: 'status',
      headerName: 'Status',
      width: 100,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          // <GridActionsCellItem
          //   icon={<DeleteIcon />}
          //   label='Delete'
          //   onClick={handleDeleteClick(id)}
          //   color='inherit'
          // />,
        ]
      },
    },
  ]

  if (isLoading) return <>Is Loading...</>

  return (
    <Box className='max-h-[600px] flex flex-col gap-y-5'>
      <section className='flex flex-row items-center justify-between'>
        <Title.Large text={t('system-clinics')} />
        <Button
          label={`${t('create')} ${t('veterinary-clinic')}`}
          onClick={handleOpen}
        />
      </section>

      <DataGrid
        rows={rows}
        columns={columns}
        editMode='row'
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        // slots={{
        //   toolbar: EditToolbar,
        // }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />

      <MuiModal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Modal
            title={`${t('create')} ${t('veterinary-clinic')}`}
            tabs={[t('create')]}
            sections={[<CreateClinicForm handleModalClose={handleClose} />]}
          />
        </Box>
      </MuiModal>
    </Box>
  )
}

function CreateClinicForm(props: { handleModalClose: () => void }) {
  const { handleModalClose } = props

  const schema = yup.object({
    name: yup.string().required(),
    telephone_number: yup
      .string()
      .length(10, 'Invalid phone number')
      .required(),
    google_maps_url: yup.string(),
    'clinic-email': yup.string().email(),
    'owner-email': yup.string().email().required(),
    address: yup.string().required(),
  })

  const { getAllUsers } = useUser()
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })

  const initialValues = {
    name: '',
    telephone_number: '',
    google_maps_url: '',
    'owner-email': '',
    'clinic-email': '',
    address: '',
  }

  const { createClinic, saveClinicImage } = useClinic()
  const queryClient = useQueryClient()

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: createClinic,
  })

  const { mutateAsync: mutateImageAsync, isPending: isLoadingImage } =
    useMutation({
      mutationFn: ({
        picture,
        id_owner,
      }: {
        picture: Picture
        id_owner: string
      }) => saveClinicImage(picture, id_owner),
    })

  const onSubmit = async (data: any) => {
    try {
      if (!picture) return
      // @ts-ignore
      const { id: clinicOwnerId, role } = users.find((user) => {
        return user.email === data['owner-email']
      })

      if (!clinicOwnerId) {
        formik.setErrors({
          'owner-email': 'Owner email does not exist',
        })
        return
      }

      if (role === Role.CLINIC_OWNER) {
        formik.setErrors({
          'owner-email': 'User is already a Clinic Owner',
        })
        return
      }

      const payload = {
        id: clinicOwnerId,
        name: data.name,
        telephone_number: data['telephone_number'],
        google_maps_url: data['google_maps_url'],
        email: data['clinic-email'],
        address: data.address,
      }

      const payloadWithoutEmptyFields = _.omitBy(payload, _.isEmpty)

      await mutateAsync(payloadWithoutEmptyFields)

      toast.promise(
        mutateImageAsync({
          picture,
          id_owner: clinicOwnerId,
        }),
        {
          success: t('updated-fields'),
          loading: t('loading'),
          error: t('something-wrong'),
        }
      )

      handleModalClose()
      queryClient.invalidateQueries()
    } catch (error) {
      toast.error('Something bad happened at editing the data.')
      console.error(error)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit,
  })

  const { t } = useTranslation()

  const [picture, setPicture] = React.useState<Picture | null>(null)

  const onDrop = React.useCallback(
    ([file]: any) => {
      setPicture(file)
    },
    [picture]
  )

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
    },
    maxSize: 3 * 1024 * 1024,
  })

  const removeFile = () => setPicture(null)

  const files = picture && (
    <li className='flex flex-row justify-between' key={picture.path}>
      {picture.name} - {picture.size} bytes{' '}
      <button
        className='px-2 py-1 text-white rounded-md bg-base-semantic-danger-500'
        onClick={removeFile}
      >
        {t('remove')}
      </button>
    </li>
  )

  if (isLoadingUsers) return <>Loading...</>

  return (
    <>
      <div
        {...getRootProps({ className: 'dropzone col-span-2' })}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='flex flex-col items-center justify-center mt-2 text-gray-500 border-2 border-gray-500 border-dashed h-52 bg-gray-50'
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className='flex flex-col items-center'>
              <CloudUploadOutlined
                className='!fill-base-primary-500'
                sx={{ fontSize: '30px' }}
              />
              {t('drop-here')}
            </div>
          ) : (
            <div className='flex flex-col items-center'>
              <CloudUploadOutlined
                className='!fill-base-primary-500'
                sx={{ fontSize: '60px' }}
              />
              {t('drag-and-drop')}
            </div>
          )}
        </div>
      </div>

      {picture && (
        <aside className='col-span-2 mt-2'>
          <ul>{files}</ul>
        </aside>
      )}

      <form
        className='grid grid-cols-2 py-12 gap-x-12 gap-y-10'
        onSubmit={formik.handleSubmit}
      >
        <Input
          variant='outlined'
          name='owner-email'
          label={t('owner-email')}
          value={formik.values['owner-email']}
          onChange={formik.handleChange}
          error={
            formik.touched['owner-email'] &&
            Boolean(formik.errors['owner-email'])
          }
          helperText={
            formik.touched['owner-email'] && formik.errors['owner-email']
          }
        />

        <Input
          variant='outlined'
          name='name'
          label={t('clinic-name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <Input
          variant='outlined'
          name='clinic-email'
          label={t('clinic-email')}
          value={formik.values['clinic-email']}
          onChange={formik.handleChange}
          error={
            formik.touched['clinic-email'] &&
            Boolean(formik.errors['clinic-email'])
          }
          helperText={
            formik.touched['clinic-email'] && formik.errors['clinic-email']
          }
        />

        <Input
          variant='outlined'
          name='telephone_number'
          label={t('telephone-number')}
          value={formik.values.telephone_number}
          onChange={formik.handleChange}
          error={
            formik.touched.telephone_number &&
            Boolean(formik.errors.telephone_number)
          }
          helperText={
            formik.touched.telephone_number && formik.errors.telephone_number
          }
        />

        <Input
          variant='outlined'
          name='google_maps_url'
          label={t('google-maps-url')}
          value={formik.values.google_maps_url}
          onChange={formik.handleChange}
          error={
            formik.touched.google_maps_url &&
            Boolean(formik.errors.google_maps_url)
          }
          helperText={
            formik.touched.google_maps_url && formik.errors.google_maps_url
          }
        />

        <Input
          variant='outlined'
          name='address'
          label={t('address')}
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />

        <Button
          type='submit'
          className='w-full col-span-2'
          label={t('create')}
          loading={isLoading || isLoadingImage}
          disabled={isEqual(formik.values, initialValues) || !picture}
        />
      </form>
    </>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
}
