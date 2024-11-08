import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppointmentBoardComponent } from './appointment-board'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppointmentBoardComponent />
  </StrictMode>,
)
