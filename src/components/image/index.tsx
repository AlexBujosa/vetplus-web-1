interface Props extends React.HTMLAttributes<HTMLImageElement> {
  src?: string
}

export default function Image(props: Props) {
  const { src, className } = props

  return <img className={className} src={src || '/images/placeholder.png'} />
}
