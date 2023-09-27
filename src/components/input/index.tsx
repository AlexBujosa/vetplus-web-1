import { OutlinedTextFieldProps, TextField } from '@mui/material'

interface Props extends OutlinedTextFieldProps {}

export default function Input(props: Props) {
  const { id, label, variant = 'outlined', size = 'small', ...others } = props

  return (
    <TextField
      id={id}
      InputProps={{
        style: {
          borderRadius: '8px',
        },
      }}
      label={label}
      variant={variant}
      size={size}
      {...others}
    />
  )
}
