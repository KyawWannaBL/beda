import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Safety check for the root element to prevent silent failures
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: The 'root' element was not found in index.html. React cannot mount.");
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical Error during React hydration:", error);
  }
}