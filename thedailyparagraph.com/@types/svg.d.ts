declare module '*.svg' {
  const content: string
  export default content

  const ReactComponent: React.ComponentType<SVGProps>
  export { ReactComponent }
}
