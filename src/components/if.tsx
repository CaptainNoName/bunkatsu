export const If = ({
  condition,
  children,
}: {
  condition: boolean
  children: React.ReactNode
}) => {
  if (condition) {
    return <>{children}</>
  }
  return null
}

// Wariant z type narrowing - używa render props
export const IfValue = <T,>({
  value,
  children,
}: {
  value: T | null | undefined
  children: (data: T) => React.ReactNode
}) => {
  if (value != null) {
    return <>{children(value)}</>
  }
  return null
}

// Wariant z dodatkowym warunkiem
export const IfValueWith = <T,>({
  value,
  condition,
  children,
}: {
  value: T | null | undefined
  condition: boolean | ((data: T) => boolean)
  children: (data: T) => React.ReactNode
}) => {
  if (value != null) {
    const shouldRender =
      typeof condition === 'function' ? condition(value) : condition
    if (shouldRender) {
      return <>{children(value)}</>
    }
  }
  return null
}
