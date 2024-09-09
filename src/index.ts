import { init, cleanup } from './widget'

if (typeof window !== 'undefined') {
  ;(window as any).OrbitalWidget = { init, cleanup }
  console.log('OrbitalWidget attached to window')
}

export * from './widget'
