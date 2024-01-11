import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/button'
import ProfileImage from '@/components/profile-image'
import StatusBadge from '@/components/status-badge'
import { Body, Headline, Title } from '@/components/typography'
import { PersonOutlined, Edit, CloudUploadOutlined } from '@mui/icons-material'
import { Box, Modal, Tab, Tabs } from '@mui/material'
import { userAtom } from '@/hooks/use-user/userAtom'
import { roleAtom } from '@/hooks/use-auth/roleAtom'
import { Role } from '@/types/role'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAtom, useAtomValue } from 'jotai'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useUser, { EditUserForm } from '@/hooks/use-user'
import Input from '@/components/input'
import CustomTabPanel from '@/components/molecules/custom-tab-panel'
import Select from '@/components/select'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { Picture } from '../clinic/general-info'
import { isEqual } from 'lodash'
import sdq from 'sdq'

yup.addMethod(yup.string, 'isDocument', function (errorMessage) {
  // @ts-ignore
  return this.test(`test-document`, errorMessage, (value: string) => {
    // @ts-ignore
    const { path, createError } = this
    return sdq.isCedula(value) || createError({ path, message: errorMessage })
  })
})

export default function ProfilePage() {
  return (
    <main className='flex flex-col gap-y-[40px]'>
      <Header />
      <GeneralDescription />
    </main>
  )
}

function Header() {
  const [user] = useAtom(userAtom)
  const [role] = useAtom(roleAtom)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { t } = useTranslation()

  if (!user || !role) return null

  const { names, surnames } = user
  const fullName = `${names} ${surnames}`

  return (
    <section className='flex flex-col gap-y-7'>
      <Headline.Medium text={fullName} />

      <div className='flex flex-row items-center justify-between gap-x-5'>
        <ProfileWithRole image={user.image} role={role} />

        <Button
          onClick={handleOpen}
          size='small'
          icon={<Edit />}
          label={t('edit')}
        />

        <Modal open={open} onClose={handleClose}>
          <UpdateUserForm />
        </Modal>
      </div>
    </section>
  )
}

export function ProfileWithRole({
  image,
  role,
}: {
  image: string
  role: Role
}) {
  return (
    <div className='flex flex-row gap-x-[10px] items-center'>
      <ProfileImage
        className='w-[100px] h-[100px]'
        src={image}
        loading={!image}
      />

      <span className='flex flex-row gap-x-[6px] p-[10px] border rounded-lg border-base-neutral-gray-500 bg-base-neutral-white text-base-neutral-gray-800 items-center'>
        <PersonOutlined />
        <Body.Large text={role} />
      </span>
    </div>
  )
}

function GeneralDescription() {
  const { getUserProfile } = useUser()
  const role = useAtomValue(roleAtom)

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const {
    email,
    telephone_number,
    address,
    status,
    document,
    VeterinariaSpecialties,
  } = user
  const { t } = useTranslation()

  const data: Record<string, JSX.Element> = {
    [t('email')]: <Typography text={email} />,
    [t('telephone-number')]: <Typography text={telephone_number} />,
    [t('document')]: <Typography text={document} />,
    [t('address')]: <Typography text={address} />,
    [t('status')]: <StatusBadge status={status} />,
  }

  if (role === 'VETERINARIAN') {
    data[t('specialty')] = (
      <Typography text={VeterinariaSpecialties?.specialties} />
    )
  }

  return (
    <div className='grid col-span-2 bg-white rounded-lg shadow-elevation-1'>
      <div className='px-[30px] py-[15px] border-b border-b-neutral-gray-500 h-fit'>
        <Title.Medium
          className='font-semibold'
          text={t('general-description')}
        />
      </div>
      <div className='grid grid-cols-2 grid-rows-auto gap-y-10 gap-x-32 px-[30px] py-[38px]'>
        {Object.keys(data).map((key) => (
          <div className='flex flex-row items-center gap-x-[30px]' key={key}>
            <Body.Large className='text-black' text={key} />

            {data[key]}
          </div>
        ))}
      </div>
    </div>
  )
}

const schema = yup.object({
  names: yup.string().required(),
  surnames: yup.string().required(),
  document: yup
    .string()
    .matches(/^[0-9]{11}$/, 'La cedula debe tener 11 digitos')
    .isDocument('Invalid document'),
  address: yup.string().required(),
  telephone_number: yup.string().required(),
  // image: yup.string(),
})

function Typography(props: { text?: string }) {
  const { text } = props

  return (
    <Body.Medium
      className='font-normal text-base-neutral-gray-800'
      text={text || 'N/A'}
    />
  )
}

function UpdateUserForm() {
  const { t } = useTranslation()

  const [value, setValue] = useState<number>(0)
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const role = useAtomValue(roleAtom)

  return (
    <Box sx={style}>
      <article className='bg-white px-[30px] py-[20px]'>
        <div className='flex flex-row items-center justify-between '>
          <Title.Small className='text-2xl' text={t('edit')} />
        </div>

        <div className='flex flex-col'>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label={t('profile')} />
              {role === 'VETERINARIAN' && <Tab label={t('professional')} />}
            </Tabs>
          </Box>

          <ProfileForm value={value} />

          <ProfessionalForm value={value} />
        </div>
      </article>
    </Box>
  )
}

interface TabsProps {
  value: number
}

function ProfileForm(props: TabsProps) {
  const { value } = props
  const { getUserProfile } = useUser()
  const { t } = useTranslation()

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const { names, surnames, document, address, telephone_number, image } = user

  const initialValues: EditUserForm = {
    names,
    surnames,
    document,
    address,
    telephone_number,
    image,
  }

  const { updateUser } = useUser()

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: updateUser,
  })

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: schema,
  })

  const queryClient = useQueryClient()
  const { saveUserImage } = useUser()
  const [picture, setPicture] = useState<Picture | null>(null)

  const { mutateAsync: mutateImageAsync, isPending: isLoadingImage } =
    useMutation({
      mutationFn: ({ picture }: { picture: Picture }) => saveUserImage(picture),
    })

  async function onSubmit(data: EditUserForm) {
    if (picture) {
      toast.promise(mutateImageAsync({ picture }), {
        success: `Image ${picture.name} - was saved succesfully`,
        error: t('something-wrong'),
        loading: 'Loading data...',
      })
    }

    console.log({ data })

    toast.promise(mutateAsync({ ...data }), {
      success: t('updated-fields'),
      error: t('something-wrong'),
      loading: 'Loading data...',
    })

    queryClient.invalidateQueries({
      queryKey: ['profile'],
    })
  }

  const onDrop = useCallback(
    ([file]: any) => {
      setPicture(file)
    },
    [picture]
  )

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
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

  return (
    <CustomTabPanel value={value} index={0}>
      <div {...getRootProps({ className: 'dropzone' })}>
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
        <aside className='mt-2'>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      )}

      <form
        className='grid grid-cols-2 gap-x-3 my-[45px] gap-y-[45px]'
        onSubmit={formik.handleSubmit}
      >
        <Input
          variant='outlined'
          label='Nombres'
          name='names'
          value={formik.values.names}
          onChange={formik.handleChange}
          error={formik.touched.names && Boolean(formik.errors.names)}
          helperText={formik.touched.names && formik.errors.names}
        />

        <Input
          variant='outlined'
          label='Apellidos'
          name='surnames'
          value={formik.values.surnames}
          onChange={formik.handleChange}
          error={formik.touched.surnames && Boolean(formik.errors.surnames)}
          helperText={formik.touched.surnames && formik.errors.surnames}
        />

        <Input
          variant='outlined'
          label='Documento'
          name='document'
          value={formik.values.document}
          onChange={formik.handleChange}
          error={formik.touched.document && Boolean(formik.errors.document)}
          helperText={formik.touched.document && formik.errors.document}
        />

        <Input
          variant='outlined'
          label='Dirección'
          name='address'
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />

        <Input
          variant='outlined'
          className='col-span-2'
          label='Número telefónico'
          name='telephone_number'
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

        <Button
          type='submit'
          className='w-full col-span-2'
          label={t('edit')}
          disabled={isEqual(formik.values, initialValues) && !picture}
          loading={isLoading || isLoadingImage}
        />
      </form>
    </CustomTabPanel>
  )
}

function ProfessionalForm(props: TabsProps) {
  const { value } = props
  const { t } = useTranslation()

  const { updateSpecialty, getUserProfile } = useUser()

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: updateSpecialty,
  })

  const initialValues = {
    specialty: user.VeterinariaSpecialties?.specialties ?? '',
  }

  const [specialty, setSpecialty] = useState<string>(initialValues.specialty)

  if (user.role !== 'VETERINARIAN') return null

  const options = [
    { label: 'Medicina General', value: 'Medicina General' },
    { label: 'Medicina Interna', value: 'Medicina Interna' },
    { label: 'Cirugía', value: 'Cirugía' },
    { label: 'Odontología', value: 'Odontología' },
    { label: 'Ortopedia', value: 'Ortopedia' },
    { label: 'Cardiología', value: 'Cardiología' },
    { label: 'Dermatología', value: 'Dermatología' },
    { label: 'Oftalmología', value: 'Oftalmología' },
  ]

  const isUserSpecialtyNotInOptions =
    initialValues.specialty &&
    !options.some(
      (option) =>
        option.value.toLowerCase() === initialValues.specialty?.toLowerCase()
    )

  // If not in options, append it
  const updatedOptions = isUserSpecialtyNotInOptions
    ? [
        ...options,
        { label: initialValues.specialty, value: initialValues.specialty },
      ]
    : options

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: schema,
  })

  const client = useQueryClient()

  async function onSubmit(data: typeof initialValues) {
    try {
      await mutateAsync({ ...data })
      client.invalidateQueries({
        queryKey: ['profile'],
      })
      toast.success(t('updated-fields'))
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <CustomTabPanel value={value} index={1}>
      <form className='flex flex-col gap-y-3' onSubmit={formik.handleSubmit}>
        <Select
          label={t('specialty')}
          options={updatedOptions}
          name='specialty'
          value={specialty}
          onChange={(e: any) => {
            setSpecialty(e.target?.value)
            formik.setFieldValue('specialty', e.target?.value)
          }}
          error={formik.touched.specialty && Boolean(formik.errors.specialty)}
        />

        <Button
          type='submit'
          label={t('edit')}
          loading={isLoading}
          disabled={isLoading}
        />
      </form>
    </CustomTabPanel>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
}
