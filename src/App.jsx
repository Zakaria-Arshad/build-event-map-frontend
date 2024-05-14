import './App.css'
import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { useEvents } from './EventContext'
import FetchedEventBox from './FetchedEventBox'

function App() {
  const { allEvents, addEvent, addAllEvents, deleteEvent } = useEvents() // eventInfo = all events, addEvent = function
  const [fetchedEvents, setFetchedEvents] = useState([])
  const [currentMapId, setCurrentMapId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [generatedSchedule, setGeneratedSchedule] = useState("");
  const [fetchMapValue, setFetchMapValue] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  }, [allEvents, fetchedEvents]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value); // update state with the input's new value
  };

  const handleFetchMapChange = (event) => {
    setFetchMapValue(event.target.value)
  }

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
    const response = await fetch(`${apiURL}/fetch-events/${searchValue}`)
    const data = await response.json()
    console.log("fetchedEvents", data)
    setFetchedEvents(data)
  }

  const generateSchedule = async () => {
    if (allEvents.length !== 0) {
    const response = await fetch(`${apiURL}/generate-schedule`, {
      method: 'POST',
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({"events": allEvents})
    })

    if (!response.ok){
      console.log("Error", response.statusText)
    }
    const newData = await response.json()
    console.log(newData)
    setGeneratedSchedule(newData)
    } else {
      return "No events to be scheduled"
    }
  }

  const fetchMap = async (event) => {
    event.preventDefault()
    const response = await fetch (`${apiURL}/fetch-map/${fetchMapValue}`) // test map
    const data = await response.json()
    console.log("fetched map events", data.events)
    addAllEvents(data.events)
  }

  const submitMap = async() => {
    if (allEvents.length !== 0) {
      const response = await fetch(`${apiURL}/create-map`, {
        method: 'POST', 
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({"events": allEvents})
      })
      const insertedIdObject = await response.json()
      console.log(insertedIdObject.inserted_id)
      setCurrentMapId(insertedIdObject.inserted_id);
    }
  }
  
  return (
    <>
    <h1>Build your Event Map. Plan your journey with AI.</h1>
    <div className="app-container">
      <div className="map-container">
        <APIProvider apiKey={apiKey}>
          <Map
            style={{ width: '65vw', height: '75vh' }}
            defaultCenter={{ lat: 39.8097343, lng: -95.5556199 }}
            defaultZoom={4.5}
            gestureHandling="greedy"
            disableDefaultUI={true}
          >
            {allEvents.map(event => (
              <Marker
                key={event.datetime_utc}
                position={{
                  lat: event['venue_location'].lat,
                  lng: event['venue_location'].lon
                }}
                onClick={(e) => handleMarkerClick(e, event)}
              />
            ))}
            {selectedEvent && (
              <InfoWindow
                position={{
                  lat: selectedEvent['venue_location'].lat,
                  lng: selectedEvent['venue_location'].lon
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <div>
                  <h2>{selectedEvent.title}</h2>
                  <p>Date: {new Date(selectedEvent.datetime_utc).toLocaleString()}</p>
                  <p>Location: {selectedEvent['venue_name']}</p>
                  <button onClick={() => deleteMarker()}>Delete Event</button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      <div className="map-inputs-container">
        <form onSubmit={handleSubmit} className="search-bar">
          <label>
            Search for events:
              <input className="input-bar" onChange={handleSearchChange}/>
          </label>
          <button className="fetch-button">FETCH EVENTS</button>
        </form>

        <form onSubmit={fetchMap} className="fetch-map">
          <label>
            Fetch Map:
              <input className="input-bar" onChange={handleFetchMapChange}/>
          </label>
          <button className="fetch-button">FETCH MAP</button>
        </form>

        <button onClick={submitMap}>Submit Map</button>
      </div>
      <p>Current Map ID: {currentMapId}</p>
      <button onClick={generateSchedule}>Generate Schedule</button>
      <p>{generatedSchedule}</p>


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
