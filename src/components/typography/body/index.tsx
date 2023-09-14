import cn from '@/utils/cn'

export interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string
}

export function ExtraLarge(props: Props) {
  const { text, className, ...rest } = props

  return (
    <p
      className={cn('font-body font-semibold text-lg leading-5', className)}
      {...rest}
    >
      {text}
    </p>
  )
}

export function Large(props: Props) {
  const { text, className, ...rest } = props

  return (
    <p
      className={cn('font-body font-medium text-sm leading-5', className)}
      {...rest}
    >
      {text}
    </p>
  )
}

export function XSLarge(props: Props) {
  const { text, className, ...rest } = props

  return (
    <p
      className={cn('font-body font-bold text-sm leading-5', className)}
      {...rest}
    >
      {text}
    </p>
  )
}

export function Medium(props: Props) {
  const { text, className, ...rest } = props

  return (
    <p
      className={cn('font-body font-medium text-xs leading-4', className)}
      {...rest}
    >
      {text}
    </p>
  )
}

export function Small(props: Props) {
  const { text, className, ...rest } = props

  return (
    <p
      className={cn('font-body font-medium text-[11px] leading-4', className)}
      {...rest}
    >
      {text}
    </p>
  )
}

export function Smaller(props: Props) {
  const { text, className, ...rest } = props

  return (
    <p
      className={cn('font-body font-light text-xs leading-3', className)}
      {...rest}
    >
      {text}
    </p>
  )
}
