import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'   // <— no extension to avoid case/extension mismatches
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
