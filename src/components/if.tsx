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
