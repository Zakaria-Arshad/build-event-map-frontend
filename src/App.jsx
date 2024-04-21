import './App.css'
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const response = await fetch(`http://127.0.0.1:8000/fetch-events/hello`)
    const data = await response.json()
    // generateSchedule(data)
  }

  async function generateSchedule(data) {
    const response = await fetch(`http://127.0.0.1:8000/generate-schedule`, {
      method: 'POST',
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({"events": data})
    })
    if (!response.ok){
      console.log("Error", response.statusText)
    }
    const newData = await response.json()
    console.log(newData)
  }

  async function fetchMap() {
    const response = await fetch (`http://127.0.0.1:8000/fetch-map/6624502ebdbe5e73293ba905`) // test map
    const data = await response.json()
  }
  
  return (
    <>
    <div>Hello</div>
    </>
      
  )
}

export default App
