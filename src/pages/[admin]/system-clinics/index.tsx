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
import { useMutation, useQuery } from '@tanstack/react-query'
import { Title } from '@/components/typography'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useClinic } from '@/hooks/use-clinic'

export default function SystemClinics() {
  const [rows, setRows] = React.useState([])
  const { getAllClinics, updateClinicByAdmin } = useClinic()

  const { isLoading } = useQuery({
    queryKey: ['users'],
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
      editable: true,
    },
    { editable: true, field: 'id_owner', headerName: 'Owner Id', width: 100 },
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
    { field: 'updated_at', headerName: 'Updated At', width: 150 },
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
      <Title.Large text={t('system-clinics')} />

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
    </Box>
  )
}
