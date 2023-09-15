import { HTMLAttributes, PropsWithChildren } from 'react'
import cn from '@/utils/cn'
import { Body } from '../typography'

interface Props extends HTMLAttributes<HTMLDivElement>, PropsWithChildren {
  label: string
}

export function Badge(props: Props) {
  const { children, label, className } = props

  return (
    <div
      className={cn(
        className,
        'flex flex-row items-center gap-x-[6px] w-fit px-2 py-[2px] rounded-md'
      )}
    >
      {children}
      <Body.Medium text={label} />
    </div>
  )
}
