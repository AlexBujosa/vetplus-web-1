import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export type Row = {
  key: string | number;
  values: (string | JSX.Element)[];
};

interface Props {
  columns: string[];
  rows: Row[];
}

export default function Table(props: Props) {
  const { columns, rows } = props;

  return (
    <TableContainer component={Paper}>
      <MuiTable sx={{ minWidth: 650 }}>
        <TableHeader columns={columns} />

        <Body rows={rows} />
      </MuiTable>
    </TableContainer>
  );
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
          );
        })}
      </TableRow>
    </TableHead>
  );
}

function Body(props: { rows: Row[] }) {
  const { rows } = props;

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.key}
          className='text-sm text-base-neutral-gray-900'
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          {row.values.map((value, index) => (
            <TableCell className='text-base-neutral-gray-900' key={index}>
              {value}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
