import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import {
  InputLabel,
  Select as MuiSelect,
  SelectProps,
} from '@mui/material'

type Option = {
  label: string
  value?: string
}

interface Props extends SelectProps {
  label?: string
  options: Option[]
  value?: string
}

export default function Select(props: Props) {
  const { label = 'Label', value, onChange, options, ...rest } = props

  return (
    <FormControl sx={{ minWidth: 120 }} size='small'>
      <InputLabel id='demo-simple-select-label'>{label}</InputLabel>
      <MuiSelect label={label} value={value} onChange={onChange} {...rest}>
        {options.map(({ label, value }) => {
          return <MenuItem value={value}>{label}</MenuItem>
        })}
      </MuiSelect>
    </FormControl>
  )
}
