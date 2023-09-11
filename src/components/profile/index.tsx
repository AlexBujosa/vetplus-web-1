import { Body } from '@/components/typography';

export function Profile({
  image,
  profile,
}: {
  image?: string;
  profile: string;
}) {
  return (
    <div className='flex flex-row items-center gap-x-3'>
      <img
        className='w-10 h-10 rounded-full'
        src={image || 'images/placeholder.png'}
      />

      <Body.Medium text={profile} />
    </div>
  );
}
