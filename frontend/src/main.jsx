import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/Store.js'
import { Toaster } from 'sonner' // Direct package import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" richColors />
    </Provider>
  </React.StrictMode>,
)