import { HTMLAttributes } from 'react'
import { Badge } from '@/components/badge'
import { useTranslation } from 'react-i18next'

interface Props extends HTMLAttributes<HTMLDivElement> {
  status: boolean
}

export default function StatusBadge(props: Props) {
  const { status } = props

  if (status) {
    return <ActiveBadge />
  }

  return <InactiveBadge />
}

function ActiveBadge() {
  const { t } = useTranslation()
  return (
    <Badge
      className='text-base-semantic-success-600 bg-base-semantic-success-50'
      label={t('active')}
    >
      <div className='w-[5px] h-[5px] bg-base-semantic-success-200 rounded-full' />
    </Badge>
  )
}

function InactiveBadge() {
  const { t } = useTranslation()
  return (
    <Badge
      className='text-base-semantic-danger-600 bg-base-semantic-danger-50'
      label={t('inactive')}
    >
      <div className='w-[5px] h-[5px] bg-base-semantic-danger-200 rounded-full' />
    </Badge>
  )
}
