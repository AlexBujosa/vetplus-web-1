import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export type Row = {
  key: string
  values: (string | JSX.Element)[]
}

interface Props {
  columns: string[]
  rows: Row[]
}

export default function Table(props: Props) {
  const { columns, rows } = props

  return (
    <TableContainer component={Paper}>
      <MuiTable sx={{ minWidth: 650 }}>
        <TableHeader columns={columns} />

        <Body rows={rows} />
      </MuiTable>
    </TableContainer>
  )
}

function TableHeader({ columns }: { columns: string[] }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column, index) => {
          return (
            <TableCell key={column} align={index !== 0 ? 'left' : undefined}>
              {column}
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

function Body(props: { rows: Row[] }) {
  const { rows } = props

  const navigate = useNavigate()

  const handleOnClick = (key: string) => navigate(key)

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.key}
          className='text-sm text-base-neutral-gray-900 hover:bg-base-neutral-gray-300 hover:cursor-pointer'
          onClick={() => handleOnClick(row.key)}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          {row.values.map((value, index) => (
            <TableCell key={index}>{value}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
