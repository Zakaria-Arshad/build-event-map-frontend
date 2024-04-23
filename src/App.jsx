import './App.css'
import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useEvents } from './EventContext'
import FetchedEventBox from './FetchedEventBox'

function App() {
  const { eventInfo, addEvent } = useEvents()
  const [fetchedEvents, setFetchedEvents] = useState([])
  const [searchValue, setSearchValue] = useState("");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    console.log(eventInfo)
  }, [eventInfo, fetchedEvents]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value); // update state with the input's new value
  };

  const handleSubmit = async(event) => {
    event.preventDefault()
    if (searchValue !== "") {
      fetchEvents()
    }
    setSearchValue("")
  }

  const fetchEvents = async() => {
    const response = await fetch(`http://127.0.0.1:8000/fetch-events/${searchValue}`)
    const data = await response.json()
    setFetchedEvents(data)
  }

  const generateSchedule = async (data) => {
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
    <div className="app-container">
      <div className="map-container">
        <APIProvider apiKey={apiKey}>
          <Map
            style={{width: '65vw', height: '80vh'}}
            defaultCenter={{lat: 39.8097343, lng: -95.5556199}}
            defaultZoom={4.5}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
          {eventInfo.map(event => (
            <Marker
              key={event.datetime_utc}
              position={{
                lat: event['venue.location'].lat,
                lng: event['venue.location'].lon 
              }}
            />
            ))}
          </Map>
        </APIProvider>

        <form onSubmit={handleSubmit}>
          <label>
            Search for events: 
            <input name="searchBar" onChange={handleSearchChange}/>
          </label>
          <button>FETCH EVENTS</button>
        </form>
      </div>
    
      <div className="fetched-events-container">
        {fetchedEvents.map((element, index) => (
          <FetchedEventBox key={index} event={element}></FetchedEventBox>
        ))}
      </div>
    </div>
    </>
  )
}

export default App
