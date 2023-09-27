import React from 'react'
import cn from '@/utils/cn'

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  src?: string
  loading?: boolean
}

export default function ProfileImage(props: Props) {
  const { src, loading, className } = props

  return (
    <img
      className={cn(
        'w-10 h-10 rounded-full cursor-pointer',
        loading && 'animate-pulse',
        className
      )}
      src={src || '/images/placeholder.png'}
    />
  )
}
