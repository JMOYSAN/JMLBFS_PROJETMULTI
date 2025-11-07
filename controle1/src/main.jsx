import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
//test
// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  window.notify('Build finished', 'All tasks completed')
})
