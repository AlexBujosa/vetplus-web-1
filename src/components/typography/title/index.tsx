import cn from '@/utils/cn'

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
}

export function Large(props: Props) {
  const { text, className, ...rest } = props

  return (
    <span
      className={cn(
        'font-title font-semibold text-[24px] leading-6',
        className
      )}
      {...rest}
    >
      {text}
    </span>
  )
}

export function Medium(props: Props) {
  const { text, className, ...rest } = props

  return (
    <span
      className={cn(
        'font-title font-semibold text-[18px] leading-6',
        className
      )}
      {...rest}
    >
      {text}
    </span>
  )
}

export function Small(props: Props) {
  const { text, className, ...rest } = props

  return (
    <span
      className={cn('font-title font-medium text-sm leading-5', className)}
      {...rest}
    >
      {text}
    </span>
  )
}
