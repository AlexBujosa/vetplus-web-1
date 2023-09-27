import { Body } from '@/components/typography'
import ProfileImage from '@/components/profile-image'

export function Profile({
  image,
  profile,
}: {
  image?: string
  profile: string
}) {
  return (
    <div className='flex flex-row items-center gap-x-3'>
      <ProfileImage src={image} loading={image === ''} />

      <Body.Medium className='text-base-neutral-gray-900' text={profile} />
    </div>
  )
}
