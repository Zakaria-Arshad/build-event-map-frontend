import './App.css'
import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { useEvents } from './EventContext'
import FetchedEventBox from './FetchedEventBox'

function App() {
  const { allEvents, addEvent, deleteEvent } = useEvents() // eventInfo = all events, addEvent = function
  const [fetchedEvents, setFetchedEvents] = useState([])
  const [searchValue, setSearchValue] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    console.log(allEvents)
  }, [allEvents, fetchedEvents]);

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

  const handleMarkerClick = (event, eventData) => {
    setSelectedEvent(eventData);
  };

  const deleteMarker = () => {
    deleteEvent(selectedEvent)
    handleInfoWindowClose()
  }

  const handleInfoWindowClose = () => {
    setSelectedEvent(null);
  };

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

  const fetchMap = async () => {
    const response = await fetch (`http://127.0.0.1:8000/fetch-map/6624502ebdbe5e73293ba905`) // test map
    const data = await response.json()
  }

  const submitMap = async() => {
    if (allEvents.length !== 0) {
      const response = await fetch(`http://127.0.0.1:8000/create-map`, {
        method: 'POST', 
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({"events": allEvents})
      })
      const insertedIdObject = await response.json()
      console.log(insertedIdObject.inserted_id)
    }
  }
  
  return (
    <>
    <h1>Build your Event Map. Plan your journey with AI.</h1>
    <div className="app-container">
      <div className="map-container">
        <APIProvider apiKey={apiKey}>
          <Map
            style={{ width: '65vw', height: '80vh' }}
            defaultCenter={{ lat: 39.8097343, lng: -95.5556199 }}
            defaultZoom={4.5}
            gestureHandling="greedy"
            disableDefaultUI={true}
          >
            {allEvents.map(event => (
              <Marker
                key={event.datetime_utc}
                position={{
                  lat: event['venue.location'].lat,
                  lng: event['venue.location'].lon
                }}
                onClick={(e) => handleMarkerClick(e, event)}
              />
            ))}
            {selectedEvent && (
              <InfoWindow
                position={{
                  lat: selectedEvent['venue.location'].lat,
                  lng: selectedEvent['venue.location'].lon
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <div>
                  <h2>{selectedEvent.title}</h2>
                  <p>Date: {new Date(selectedEvent.datetime_utc).toLocaleString()}</p>
                  <p>Location: {selectedEvent['venue.name']}</p>
                  <button onClick={() => deleteMarker()}>Delete Event</button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        <form onSubmit={handleSubmit} className="search-bar">
          <label>
            Search for events:
              <input className="input-bar" onChange={handleSearchChange}/>
          </label>
          <button className="fetch-button">FETCH EVENTS</button>
        </form>

        <button onClick={submitMap}>Submit Map</button>

      </div>
      <div className="fetched-events-container">
        {fetchedEvents.length === 0 && <p>No events fetched...</p>}
        {fetchedEvents.map((element, index) => (
          <FetchedEventBox key={index} event={element}></FetchedEventBox>
        ))}
      </div>
    </div>
    </>
  )
}

export default App
