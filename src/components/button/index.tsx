import cn from '@/utils/cn'
import { VariantProps, cva } from 'class-variance-authority'
import { CircularProgress } from '@mui/material'

const button = cva(
  [
    'flex',
    'items-center',
    'justify-center',
    'gap-[3px]',
    'font-semibold',
    'rounded-[10px]',
    'w-fit',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-base-primary-500',
          'hover:bg-base-primary-600',
          'text-white',
          'border-transparent',
          'disabled:bg-base-neutral-gray-500',
          'disabled:text-base-neutral-gray-800',
        ],
        outline: [
          'bg-white',
          'text-base-primary-500',
          'border',
          'border-base-primary-500',
        ],
        tertiary: ['bg-none', 'hover:bg-base-neutral-gray-400'],
      },
      size: {
        small: ['text-md', 'py-[10px]', 'px-3', 'h-[50px]'],
        medium: ['text-2xl', 'py-[17px]', 'px-4'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'small',
    },
  }
)

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button>,
    React.PropsWithChildren {
  label?: string
  loading?: boolean
  icon?: React.ReactNode
}

export default function Button(props: Props) {
  const {
    intent,
    size,
    label,
    loading,
    icon,
    children,
    type,
    className,
    ...rest
  } = props

  return (
    <button
      type={type}
      className={cn(button({ intent, size, className }))}
      {...rest}
    >
      <ButtonContent
        icon={icon}
        label={label!}
        loading={loading}
        children={children}
      />
    </button>
  )
}

interface ButtonContentProps extends React.PropsWithChildren {
  label: string
  loading?: boolean
  icon?: React.ReactNode
}

function ButtonContent(props: ButtonContentProps) {
  const { icon, label, loading, children } = props

  if (loading) {
    return <CircularProgress size={20} color='inherit' />
  }

  return (
    <>
      {icon}
      {label}
      {children}
    </>
  )
}
