import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Global API Test Call
async function getData() {
    try {
        const response = await fetch(
            "https://suryabank.onrender.com/api/test"
        );
        const data = await response.json();
        console.log("Global API Test:", data);
    } catch (error) {
        console.error("Global API Test Failed:", error);
    }
}

getData();