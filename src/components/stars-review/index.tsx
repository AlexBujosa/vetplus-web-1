import { HTMLAttributes } from 'react'
import cn from '@/utils/cn'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'

interface Props extends HTMLAttributes<HTMLDivElement> {
  review: number
}

export default function StarsReview(props: Props) {
  const { review, className } = props

  if (review < 0) return

  const fullStars = Math.floor(review)
  const hasHalfStar = review % 1 !== 0

  return (
    <div className={cn(className, 'flex flex-row')}>
      {[...Array(fullStars)].map((e, i) => (
        <StarIcon className='text-base-orange-500' key={i} />
      ))}

      {hasHalfStar && <StarHalfIcon className='text-base-orange-500' />}
    </div>
  )
}
