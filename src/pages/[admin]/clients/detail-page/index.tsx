import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import StatusBadge from '@/components/status-badge'
import { Headline, Body, Title } from '@/components/typography'
import { routes } from '@/config/routes'
import { KeyboardBackspace } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ProfileWithRole } from '../../profile'

export default function ClientsDetailPage() {
  const params = useParams()
  const client = useQueryClient()
  const { email: clientEmail } = params

  const clinicClients: any[] | undefined = client.getQueryData(['clients'])

  if (!clinicClients) return null

  const clinicClient = clinicClients.find(({ User }) => {
    const { email } = User
    return email === clientEmail
  })

  return (
    <div>
      <ClientHeader client={clinicClient.User} />
      <GeneralDescription client={clinicClient} />
    </div>
  )
}

function ClientHeader({ client }: { client: any }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <section className='flex flex-col mb-6 gap-y-7'>
      <div className='flex flex-row gap-x-[20px]'>
        <IconButton
          onClick={() => navigate(routes.admin.pages.clients.href)}
          children={<KeyboardBackspace className='text-black' />}
        />
        <Headline.Medium text={`${client.names} ${client.surnames}`} />
      </div>

      <div className='flex flex-row items-center justify-between gap-x-5'>
        <ProfileWithRole image={client.image} role={t('pet-owner')} />
      </div>
    </section>
  )
}

function GeneralDescription({ client }: { client: any }) {
  const { email, telephone_number, address, specialty, status } = client.User
  const { t } = useTranslation()

  const data: Record<string, JSX.Element> = {
    [t('email')]: <Typography text={email} />,
    [t('telephone-number')]: <Typography text={telephone_number} />,
    [t('address')]: <Typography text={address} />,
    [t('speciality')]: <Typography text={specialty} />,
    // [t('review')]: <StarsReview review={score} />,
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

function Typography(props: { text?: string }) {
  const { text } = props

  return (
    <Body.Medium
      className='font-normal text-base-neutral-gray-800'
      text={text || 'N/A'}
    />
  )
}
