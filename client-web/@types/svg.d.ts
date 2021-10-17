declare module '*.svg' {
  import { SVGProps } from 'react'

  const SVGComponent: React.ComponentType<SVGProps<SVGElement>>
  export default SVGComponent
}
