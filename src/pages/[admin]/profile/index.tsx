import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/button'
import ProfileImage from '@/components/profile-image'
import StatusBadge from '@/components/status-badge'
import { Body, Headline, Title } from '@/components/typography'
import { PersonOutlined, Edit } from '@mui/icons-material'
import { Box, Modal } from '@mui/material'
import { userAtom } from '@/hooks/use-user/userAtom'
import { roleAtom } from '@/hooks/use-auth/roleAtom'
import { Role } from '@/types/role'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useAtom } from 'jotai'
import { useMutation, useQuery } from '@tanstack/react-query'
import useUser, { EditUserForm } from '@/hooks/use-user'
import Input from '@/components/input'

export default function ProfilePage() {
  return (
    <main className='flex flex-col gap-y-[60px]'>
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
  const { t } = useTranslation()

  const roleString: Record<Role, string> = {
    ADMIN: t('admin'),
    CLINIC_OWNER: t('clinic-owner'),
    PET_OWNER: t('pet-owner'),
    VETERINARIAN: t('veterinary'),
  }

  return (
    <div className='flex flex-row gap-x-[10px] items-center'>
      <ProfileImage
        className='w-[100px] h-[100px]'
        src={image}
        loading={!image}
      />

      <span className='flex flex-row gap-x-[6px] p-[10px] border border-base-neutral-gray-500 text-base-neutral-gray-800'>
        <PersonOutlined />
        <Body.Large text={roleString[role]} />
      </span>
    </div>
  )
}

function GeneralDescription() {
  const { getUserProfile } = useUser()

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const { email, telephone_number, address, status } = user
  const { t } = useTranslation()

  const data: Record<string, JSX.Element> = {
    [t('email')]: <Typography text={email} />,
    [t('telephone-number')]: <Typography text={telephone_number} />,
    [t('address')]: <Typography text={address} />,
    // [t('speciality')]: <Typography text={'specialty'} />,
    // [t('review')]: <StarsReview review={2} />,
    [t('status')]: <StatusBadge status={status} />,
  }

  return (
    <section className='shadow-elevation-1'>
      <div className='px-[30px] py-[15px] border border-b-base-neutral-gray-500'>
        <Title.Medium
          className='font-semibold'
          text={t('general-description')}
        />
      </div>

      <div className='grid grid-cols-2 grid-rows-3 p-[30px]'>
        {Object.keys(data).map((key) => (
          <div className='flex flex-row items-center gap-x-[30px]' key={key}>
            <Body.Large className='text-black' text={key} />

            {data[key]}
          </div>
        ))}
      </div>
    </section>
  )
}

const schema = yup.object({
  names: yup.string(),
  surnames: yup.string(),
  document: yup.string(),
  address: yup.string(),
  telephone_number: yup.string(),
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
  const { getUserProfile } = useUser()

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const { names, surnames, document, address, telephone_number } = user

  const initialValues: EditUserForm = {
    names,
    surnames,
    document,
    address,
    telephone_number,
  }

  const { updateUser } = useUser()

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: updateUser,
  })

  const onSubmit = async (data: EditUserForm) => {
    await mutate({ ...data })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: schema,
  })

  const { t } = useTranslation()

  return (
    <Box sx={style}>
      <article className='bg-white px-[30px] py-[20px]'>
        <h2>Editar</h2>

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
            loading={isLoading}
          />
        </form>
      </article>
    </Box>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
}
