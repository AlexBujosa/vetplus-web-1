import cn from '@/utils/cn'

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
}

export function Large(props: Props) {
  const { text, className, ...rest } = props

  return (
    <span
      className={cn(
        'font-display font-semibold text-[57px] leading-[64px]',
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
        'font-display font-medium text-[45px] leading-[52px]',
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
      className={cn(
        'font-display font-normal text-4xl leading-[44px]',
        className
      )}
      {...rest}
    >
      {text}
    </span>
  )
}
