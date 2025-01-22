import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "./quill.css"
import { ColorProvider } from './contexts/ColourContext.jsx';

createRoot(document.getElementById('root')).render(
  <ColorProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ColorProvider>
)
