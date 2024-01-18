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
import useUser from '@/hooks/use-user'
import toast from 'react-hot-toast'

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([])
  const { updateUserByAdmin, getAllUsers } = useUser()

  const { isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await getAllUsers()
      setRows(data)
      return data
    },
  })

  const { mutateAsync } = useMutation({
    mutationFn: updateUserByAdmin,
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
    const { created_at, updated_at, __typename, provider, ...rest } = newRow
    // @ts-ignore
    const updatedUser = { ...newRow }
    // @ts-ignore
    toast.promise(mutateAsync({ ...rest }), {
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
    { editable: true, field: 'names', headerName: 'Names', width: 100 },
    { editable: true, field: 'surnames', headerName: 'Surnames', width: 100 },
    { editable: true, field: 'email', headerName: 'Email', width: 150 },
    { editable: true, field: 'document', headerName: 'Document', width: 150 },
    { editable: true, field: 'address', headerName: 'Address' },
    {
      editable: true,
      field: 'telephone_number',
      headerName: 'Telephone Number',
    },
    { editable: true, field: 'image', headerName: 'Image' },
    { field: 'provider', headerName: 'Login Provider' },
    { editable: true, field: 'status', headerName: 'Status' },
    {
      field: 'role',
      headerName: 'Role',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['PET_OWNER', 'ADMIN', 'CLINIC_OWNER'],
    },
    { field: 'created_at', headerName: 'Created At', width: 150 },
    { field: 'updated_at', headerName: 'Updated At', width: 150 },
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
      <Title.Large text={t('system-users')} />

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
