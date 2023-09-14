import cn from '@/utils/cn'

export interface Props extends React.HTMLAttributes<HTMLLabelElement> {
  text: string
}

export function ExtraLarge(props: Props) {
  const { text, className, ...rest } = props

  return (
    <label
      className={cn('font-label font-semibold text-base leading-6', className)}
      {...rest}
    >
      {text}
    </label>
  )
}

export function Large(props: Props) {
  const { text, className, ...rest } = props

  return (
    <label
      className={cn('font-label font-medium text-base leading-4', className)}
      {...rest}
    >
      {text}
    </label>
  )
}

export function XSLarge(props: Props) {
  const { text, className, ...rest } = props

  return (
    <label
      className={cn('font-label font-bold text-[14px] leading-4', className)}
      {...rest}
    >
      {text}
    </label>
  )
}

export function Medium(props: Props) {
  const { text, className, ...rest } = props

  return (
    <label
      className={cn('font-label font-medium text-xs leading-4', className)}
      {...rest}
    >
      {text}
    </label>
  )
}

export function Small(props: Props) {
  const { text, className, ...rest } = props

  return (
    <label
      className={cn('font-label font-light text-xs leading-4', className)}
      {...rest}
    >
      {text}
    </label>
  )
}
