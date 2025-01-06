export type InitOptions = {
  container: string | string[] | HTMLElement | HTMLElement[]
  mode?: 'iframe-only' | 'small-widgets'
  button?: {
    color?: 'white-black' | 'black-white' | 'red-white' | 'red-black' | 'blue-white'
    logoOnly?: boolean
    container?: string | HTMLElement
    onClickCallback?: (...args: any[]) => void
    width?: string
    height?: string
  }
}
