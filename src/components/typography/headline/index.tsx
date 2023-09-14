import cn from '@/utils/cn'

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
}

export function Large(props: Props) {
  const { text, className, ...rest } = props

  return (
    <span
      className={cn(
        'font-headline font-semibold text-[32px] leading-10',
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
        'font-headline font-medium text-[28px] leading-9',
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
      className={cn('font-headline font-normal text-2xl leading-8', className)}
      {...rest}
    >
      {text}
    </span>
  )
}
