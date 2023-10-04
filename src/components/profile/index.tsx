import { Body } from '@/components/typography'
import ProfileImage from '@/components/profile-image'
import cn from '@/utils/cn'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  image?: string
  profile: string
}

export function Profile(props: Props) {
  const { image, profile, className } = props

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-x-3 text-base-neutral-gray-900',
        className
      )}
    >
      <ProfileImage src={image} loading={image === ''} />

      <Body.Medium text={profile} />
    </div>
  )
}
