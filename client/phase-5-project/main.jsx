import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App'
import { BrowserRouter as Router } from 'react-router-dom'
import { Buffer } from 'buffer'

globalThis.Buffer=Buffer

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>
)