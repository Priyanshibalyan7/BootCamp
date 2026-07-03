export default function Button({ variant = 'primary', children, style, ...props }) {
  return (
    <button className={`btn btn-${variant}`} style={style} {...props}>
      {children}
    </button>
  )
}
