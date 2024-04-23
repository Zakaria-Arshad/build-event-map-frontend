import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { EventProvider } from './EventContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <EventProvider>
        <App />
    </EventProvider>
)
