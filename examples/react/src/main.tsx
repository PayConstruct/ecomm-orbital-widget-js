import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OrbitalWidget from './components/OrbitalWidget'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrbitalWidget />
  </StrictMode>
)
