import Button from '@/components/button'
import Input from '@/components/input'
import { IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import * as yup from 'yup'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import useAuth, { LoginSubmitForm } from '@/hooks/use-auth'
import { useState } from 'react'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
})

const initialValues: LoginSubmitForm = {
  email: '',
  password: '',
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { loginWithEmail } = useAuth()

  const onSubmit = async (data: LoginSubmitForm) => {
    try {
      await loginWithEmail(data)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit,
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  return (
    <>
      <form
        className='flex flex-col my-[45px] gap-y-[45px]'
        onSubmit={formik.handleSubmit}
      >
        <Input
          variant='outlined'
          label='Correo'
          className='w-[380px]'
          name='email'
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <Input
          variant='outlined'
          label='Contraseña'
          name='password'
          type={showPassword ? 'text' : 'password'}
          className='w-[380px]'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          className='w-full'
          type='submit'
          intent='primary'
          label='Continuar'
          loading={formik.isSubmitting}
        />
      </form>

      {/* <Link className='text-center text-base-primary-500' to='/forgot-password'>
        <Body.Medium
          className='font-medium'
          text='¿No puedes iniciar sesión?'
        />
      </Link> */}
    </>
  )
}
