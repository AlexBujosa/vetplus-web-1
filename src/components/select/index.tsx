import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import {
  InputLabel,
  Select as MuiSelect,
  SelectChangeEvent,
} from '@mui/material'

type Option = {
  label: string
  value: string | undefined
}

interface Props {
  label?: string
  options: Option[]
  value: string | undefined
  onChange: (event: SelectChangeEvent) => void
}

export default function Select(props: Props) {
  const { label = 'Label', value, onChange, options } = props

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
      <InputLabel id='demo-simple-select-label'>{label}</InputLabel>
      <MuiSelect label={label} value={value} onChange={onChange}>
        {options.map(({ label, value }) => {
          return <MenuItem value={value}>{label}</MenuItem>
        })}
      </MuiSelect>
    </FormControl>
  )
}
